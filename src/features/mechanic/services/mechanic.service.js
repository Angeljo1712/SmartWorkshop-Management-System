const { pool } = require("../../../shared/config/pool");
const { AppError } = require("../../../shared/utils/appError");
const {
  sendMechanicAccountReadyEmail,
  sendMechanicSetupCodeEmail
} = require("../../../shared/infrastructure/email/email.service");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const resolveMechanicAvatarUrl = (user) => {
  return String(user?.avatar_url || "").trim();
};

const getLatestAddress = async (userId) => {
  const [rows] = await pool.query(
    `SELECT line1, line2, city, postal_code, country,
            ST_Y(location) AS lat, ST_X(location) AS lng
     FROM addresses
     WHERE user_id = ?
     ORDER BY id DESC
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
};

const getAddressByLabel = async (userId, label) => {
  const [rows] = await pool.query(
    `SELECT line1, line2, city, postal_code, country,
            ST_Y(location) AS lat, ST_X(location) AS lng
     FROM addresses
     WHERE user_id = ? AND label = ?
     ORDER BY id DESC
     LIMIT 1`,
    [userId, label]
  );
  return rows[0] || null;
};

const getQualifications = async (userId) => {
  const [rows] = await pool.query(
    `SELECT name FROM mechanic_qualifications
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows.map((row) => row.name);
};

const getMemberships = async (userId) => {
  const [rows] = await pool.query(
    `SELECT name FROM mechanic_memberships
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows.map((row) => row.name);
};

let ensureUserProfileMiddleNameColumnPromise = null;
const ensureUserProfileMiddleNameColumn = async () => {
  if (!ensureUserProfileMiddleNameColumnPromise) {
    ensureUserProfileMiddleNameColumnPromise = (async () => {
      const [rows] = await pool.query(
        `SELECT COLUMN_NAME
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'user_profiles'
           AND COLUMN_NAME = 'middle_name'`
      );
      if (!rows.length) {
        await pool.query("ALTER TABLE user_profiles ADD COLUMN middle_name VARCHAR(120) NULL AFTER name");
      }
    })().catch((error) => {
      ensureUserProfileMiddleNameColumnPromise = null;
      throw error;
    });
  }
  return ensureUserProfileMiddleNameColumnPromise;
};

const ensureMechanicAccreditationsTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS mechanic_accreditations (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      user_id BIGINT UNSIGNED NOT NULL,
      name VARCHAR(160) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      KEY idx_ma_user (user_id),
      CONSTRAINT fk_ma_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`
  );
};

const addQualification = async ({ userId, name }) => {
  const trimmed = String(name || "").trim();
  if (!trimmed) return;
  await pool.query(
    "INSERT INTO mechanic_qualifications (user_id, name) VALUES (?, ?)",
    [userId, trimmed]
  );
};

const ensureUserByEmail = async ({ email, firstName, lastName, phone }) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) {
    throw new AppError("VALIDATION_ERROR", "email is required", 400);
  }

  const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [normalizedEmail]);
  if (rows[0]) {
    if (phone) {
      await pool.query("UPDATE users SET phone = ? WHERE id = ?", [phone, rows[0].id]);
    }
    return rows[0].id;
  }

  const passwordHash = await bcrypt.hash(crypto.randomBytes(18).toString("hex"), 10);
  const username = String(normalizedEmail || "").trim().toLowerCase();
  await ensureUserProfileMiddleNameColumn();
  const normalizedFirstName = String(firstName || "").trim();
  const normalizedLastName = String(lastName || "").trim();
  const [result] = await pool.query(
    "INSERT INTO users (uuid_public, email, username, password_hash, role, status, phone) VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?, ?)",
    [normalizedEmail, username, passwordHash, "user", "active", phone || null]
  );
  const userId = result.insertId;
  await pool.query(
    "INSERT INTO user_profiles (user_id, name, middle_name, lastname) VALUES (?, ?, ?, ?)",
    [userId, normalizedFirstName || "-", null, normalizedLastName || "-"]
  );
  await pool.query("INSERT INTO user_roles (user_id, role) VALUES (?, ?)", [userId, "user"]);
  return userId;
};

const updateProfile = async ({ userId, years_experience, work_history, memberships }) => {
  const years = years_experience === "" || years_experience === undefined ? null : Number(years_experience);
  const history = String(work_history || "").trim() || null;

  await pool.query(
    `INSERT INTO mechanic_profiles (user_id, display_name, legal_name, years_experience, work_history)
     VALUES (?, '-', '-', ?, ?)
     ON DUPLICATE KEY UPDATE years_experience = VALUES(years_experience), work_history = VALUES(work_history)`,
    [userId, years, history]
  );

  await pool.query("DELETE FROM mechanic_memberships WHERE user_id = ?", [userId]);
  const list = Array.isArray(memberships) ? memberships : memberships ? [memberships] : [];
  for (const name of list) {
    const trimmed = String(name || "").trim();
    if (!trimmed) continue;
    await pool.query("INSERT INTO mechanic_memberships (user_id, name) VALUES (?, ?)", [userId, trimmed]);
  }
};

const ensureMechanicDocumentsTable = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS mechanic_documents (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      user_id BIGINT UNSIGNED NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(255) NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      file_size INT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      KEY idx_md_user (user_id),
      CONSTRAINT fk_md_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`
  );
};

const backfillMechanicApplicationStatuses = async () => {
  await ensureMechanicDocumentsTable();
  await pool.query(
    `UPDATE mechanic_profiles mp
     SET application_status = 'documents_uploaded'
     WHERE mp.application_status IN ('application_saved', 'documents_uploaded', 'lead_created', 'password_pending', 'password_created')
       AND EXISTS (
         SELECT 1
         FROM mechanic_documents md
         WHERE md.user_id = mp.user_id
       )`
  );
  await pool.query(
    `UPDATE mechanic_profiles
     SET account_status = 'active'
     WHERE application_status = 'approved'`
  );
  await pool.query(
    `UPDATE mechanic_profiles
     SET account_status = 'rejected'
     WHERE application_status = 'rejected'`
  );
  await pool.query(
    `UPDATE mechanic_profiles
     SET account_status = 'pending'
     WHERE application_status IN ('application_saved', 'documents_uploaded', 'info_requested', 'password_created', 'password_pending', 'lead_created')`
  );
};

const ensureMechanicInfoRequestColumns = async () => {
  const [rows] = await pool.query(
    `SELECT COLUMN_NAME
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'mechanic_profiles'
       AND COLUMN_NAME IN ('info_request_note', 'info_requested_at')`
  );
  const existing = new Set(rows.map((row) => row.COLUMN_NAME));
  if (!existing.has("info_request_note")) {
    await pool.query("ALTER TABLE mechanic_profiles ADD COLUMN info_request_note TEXT NULL AFTER account_status");
  }
  if (!existing.has("info_requested_at")) {
    await pool.query("ALTER TABLE mechanic_profiles ADD COLUMN info_requested_at DATETIME NULL AFTER info_request_note");
  }
};

const resolveNextMechanicAccountStatus = (profileRow) => {
  const applicationStatus = String(profileRow?.application_status || "").trim().toLowerCase();
  const accountStatus = String(profileRow?.account_status || "").trim().toLowerCase();
  if (applicationStatus === "approved" || accountStatus === "active") {
    return "active";
  }
  return "pending";
};

const listMechanicDocumentsByUserId = async (userId) => {
  await ensureMechanicDocumentsTable();
  const [rows] = await pool.query(
    `SELECT id, original_name, file_path, mime_type, file_size, created_at
     FROM mechanic_documents
     WHERE user_id = ?
     ORDER BY created_at DESC, id DESC`,
    [userId]
  );

  return rows.map((row) => ({
    id: Number(row.id),
    original_name: row.original_name,
    file_path: row.file_path,
    mime_type: row.mime_type,
    file_size: Number(row.file_size || 0),
    created_at: row.created_at
  }));
};

const savePremisesAddress = async ({ userId, line1, city, postalCode }) => {
  const street = String(line1 || "").trim();
  const locality = String(city || "").trim();
  const postcode = String(postalCode || "").trim();
  if (!street || !locality || !postcode) return;

  const [rows] = await pool.query(
    `SELECT id
     FROM addresses
     WHERE user_id = ? AND label = 'Premises'
     ORDER BY id DESC
     LIMIT 1`,
    [userId]
  );

  if (rows[0]) {
    await pool.query(
      `UPDATE addresses
       SET line1 = ?, city = ?, postal_code = ?, country = 'GB',
           location = ST_SRID(POINT(0, 0), 4326)
       WHERE id = ?`,
      [street, locality, postcode, rows[0].id]
    );
    return;
  }

  await pool.query(
    `INSERT INTO addresses
     (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
     VALUES (UUID_TO_BIN(UUID()), ?, 'Premises', ?, NULL, ?, ?, 'GB', ST_SRID(POINT(0, 0), 4326))`,
    [userId, street, locality, postcode]
  );
};

const ensureMechanicProfileOnboardingColumns = async () => {
  const [rows] = await pool.query(
    `SELECT COLUMN_NAME
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'mechanic_profiles'
       AND COLUMN_NAME IN ('application_type', 'lead_postcode', 'application_status', 'account_status', 'password_set_at', 'travel_radius_miles', 'availability_pref', 'referral_source')`
  );

  const existing = new Set(rows.map((row) => row.COLUMN_NAME));

  if (!existing.has("application_type")) {
    await pool.query(
      "ALTER TABLE mechanic_profiles ADD COLUMN application_type VARCHAR(64) NULL AFTER business_type"
    );
  }

  if (!existing.has("lead_postcode")) {
    await pool.query(
      "ALTER TABLE mechanic_profiles ADD COLUMN lead_postcode VARCHAR(16) NULL AFTER application_type"
    );
  }

  if (!existing.has("application_status")) {
    await pool.query(
      "ALTER TABLE mechanic_profiles ADD COLUMN application_status VARCHAR(64) NULL AFTER lead_postcode"
    );
  }

  if (!existing.has("account_status")) {
    await pool.query(
      "ALTER TABLE mechanic_profiles ADD COLUMN account_status VARCHAR(64) NULL AFTER application_status"
    );
  }

  if (!existing.has("password_set_at")) {
    await pool.query(
      "ALTER TABLE mechanic_profiles ADD COLUMN password_set_at DATETIME NULL AFTER account_status"
    );
  }

  if (!existing.has("travel_radius_miles")) {
    await pool.query(
      "ALTER TABLE mechanic_profiles ADD COLUMN travel_radius_miles INT NULL AFTER account_status"
    );
  }

  if (!existing.has("availability_pref")) {
    await pool.query(
      "ALTER TABLE mechanic_profiles ADD COLUMN availability_pref VARCHAR(64) NULL AFTER travel_radius_miles"
    );
  }

  if (!existing.has("referral_source")) {
    await pool.query(
      "ALTER TABLE mechanic_profiles ADD COLUMN referral_source VARCHAR(255) NULL AFTER availability_pref"
    );
  }

  await backfillMechanicApplicationStatuses();
};

const ensureMechanicPasswordSetupTables = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS mechanic_password_setup_challenges (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      user_id BIGINT UNSIGNED NOT NULL UNIQUE,
      challenge_token CHAR(64) NOT NULL UNIQUE,
      code_hash TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      consumed_at DATETIME NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      KEY idx_mpsc_expires (expires_at),
      CONSTRAINT fk_mpsc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`
  );
};

const hasMechanicUploadedDocuments = async (userId) => {
  await ensureMechanicDocumentsTable();
  const [[row]] = await pool.query(
    "SELECT COUNT(*) AS count FROM mechanic_documents WHERE user_id = ?",
    [userId]
  );
  return Number(row?.count || 0) > 0;
};

const saveApplication = async (payload) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    years_experience,
    work_history,
    certifications,
    accreditations,
    memberships,
    has_website,
    website,
    trade_insurance,
    public_liability,
    vat_registered,
    services,
    specialist_services,
    specialist_services_other,
    application_type,
    business_type,
    postcode,
    premises_address,
    premises_city,
    premises_postcode,
    travel_radius,
    availability,
    referral
  } = payload || {};

  if (!email) {
    throw new AppError("VALIDATION_ERROR", "email is required", 400);
  }

  const userId = await ensureUserByEmail({
    email,
    firstName: first_name,
    lastName: last_name,
    phone
  });

  const websiteValue = String(has_website || "").toLowerCase() === "yes"
    ? (String(website || "").trim() || null)
    : null;
  const historyList = Array.isArray(work_history) ? work_history : work_history ? [work_history] : [];
  const historyText = historyList.map((value) => String(value || "").trim()).filter(Boolean).join(", ");
  const trade = String(trade_insurance || "").toLowerCase() === "yes" ? 1 : 0;
  const liability = String(public_liability || "").toLowerCase() === "yes" ? 1 : 0;
  const vat = String(vat_registered || "").toLowerCase() === "yes" ? 1 : 0;
  const travel = travel_radius === "" || travel_radius === undefined ? null : Number(travel_radius);
  const applicationTypeValue = String(application_type || "").trim() || null;
  const leadPostcodeValue = String(postcode || "").trim().toUpperCase() || null;

  await ensureMechanicProfileOnboardingColumns();
  await ensureMechanicInfoRequestColumns();

  await pool.query(
    `INSERT INTO mechanic_profiles
     (user_id, display_name, legal_name, years_experience, work_history, website_url,
      has_trade_insurance, has_public_liability, vat_registered, business_type, application_type, lead_postcode,
      application_status, account_status,
      travel_radius_miles, availability_pref, referral_source)
     VALUES (?, '-', '-', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       years_experience = VALUES(years_experience),
       work_history = VALUES(work_history),
       website_url = VALUES(website_url),
       has_trade_insurance = VALUES(has_trade_insurance),
       has_public_liability = VALUES(has_public_liability),
       vat_registered = VALUES(vat_registered),
       business_type = VALUES(business_type),
       application_type = VALUES(application_type),
       lead_postcode = VALUES(lead_postcode),
       application_status = VALUES(application_status),
       account_status = VALUES(account_status),
       travel_radius_miles = VALUES(travel_radius_miles),
       availability_pref = VALUES(availability_pref),
       referral_source = VALUES(referral_source)`,
    [
      userId,
      years_experience || null,
      historyText || null,
      websiteValue,
      trade,
      liability,
      vat,
      business_type || null,
      applicationTypeValue,
      leadPostcodeValue,
      "application_saved",
      "pending",
      travel,
      availability || null,
      referral || null
    ]
  );

  await savePremisesAddress({
    userId,
    line1: premises_address,
    city: premises_city,
    postalCode: premises_postcode
  });

  await pool.query("DELETE FROM mechanic_qualifications WHERE user_id = ?", [userId]);
  const certList = Array.isArray(certifications) ? certifications : certifications ? [certifications] : [];
  for (const name of certList) {
    const trimmed = String(name || "").trim();
    if (!trimmed) continue;
    await pool.query("INSERT INTO mechanic_qualifications (user_id, name) VALUES (?, ?)", [userId, trimmed]);
  }

  await ensureMechanicAccreditationsTable();
  await pool.query("DELETE FROM mechanic_accreditations WHERE user_id = ?", [userId]);
  const accreditationList = Array.isArray(accreditations) ? accreditations : accreditations ? [accreditations] : [];
  for (const name of accreditationList) {
    const trimmed = String(name || "").trim();
    if (!trimmed) continue;
    await pool.query("INSERT INTO mechanic_accreditations (user_id, name) VALUES (?, ?)", [userId, trimmed]);
  }

  await pool.query("DELETE FROM mechanic_memberships WHERE user_id = ?", [userId]);
  const memberList = Array.isArray(memberships) ? memberships : memberships ? [memberships] : [];
  for (const name of memberList) {
    const trimmed = String(name || "").trim();
    if (!trimmed) continue;
    await pool.query("INSERT INTO mechanic_memberships (user_id, name) VALUES (?, ?)", [userId, trimmed]);
  }

  await pool.query("DELETE FROM mechanic_services_offered WHERE user_id = ?", [userId]);
  const serviceList = Array.isArray(services) ? services : services ? [services] : [];
  const specialistList = Array.isArray(specialist_services)
    ? specialist_services
    : specialist_services
      ? [specialist_services]
      : [];
  const specialistOther = String(specialist_services_other || "").trim();
  const allServices = [...new Set([
    ...serviceList,
    ...specialistList,
    ...(specialistOther ? [`other:${specialistOther}`] : [])
  ])];
  for (const svc of allServices) {
    const trimmed = String(svc || "").trim();
    if (!trimmed) continue;
    await pool.query("INSERT INTO mechanic_services_offered (user_id, service_type) VALUES (?, ?)", [
      userId,
      trimmed
    ]);
  }

  return { userId };
};

const saveUploadedDocumentsByEmail = async ({ email, files }) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) {
    throw new AppError("VALIDATION_ERROR", "email is required", 400);
  }
  if (!Array.isArray(files) || !files.length) {
    throw new AppError("VALIDATION_ERROR", "At least one document is required", 400);
  }

  const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [normalizedEmail]);
  const user = rows[0];
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }

  await ensureMechanicDocumentsTable();
  for (const file of files) {
    await pool.query(
      `INSERT INTO mechanic_documents (user_id, original_name, file_path, mime_type, file_size)
       VALUES (?, ?, ?, ?, ?)`,
      [user.id, file.originalname, `/uploads/mechanic-documents/${file.filename}`, file.mimetype, file.size]
    );
  }

  await ensureMechanicProfileOnboardingColumns();
  await ensureMechanicInfoRequestColumns();
  await pool.query(
    `UPDATE mechanic_profiles
     SET application_status = 'documents_uploaded',
         account_status = 'pending'
     WHERE user_id = ?`,
    [user.id]
  );

  return { userId: user.id, count: files.length };
};

const completeApplication = async ({ email }) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) {
    throw new AppError("VALIDATION_ERROR", "email is required", 400);
  }

  const [rows] = await pool.query(
    `SELECT u.id, u.email, p.name, p.middle_name, p.lastname
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     WHERE u.email = ?`,
    [normalizedEmail]
  );
  const user = rows[0];
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }

  await pool.query(
    "INSERT INTO user_roles (user_id, role) VALUES (?, ?) ON DUPLICATE KEY UPDATE role = role",
    [user.id, "mechanic"]
  );
  await pool.query("UPDATE users SET role = 'mechanic', status = 'pending' WHERE id = ?", [user.id]);
  await ensureMechanicProfileOnboardingColumns();
  await ensureMechanicInfoRequestColumns();

  const displayName = [user.name, user.middle_name, user.lastname].filter(Boolean).join(" ") || user.email;
  const applicationStatus = (await hasMechanicUploadedDocuments(user.id))
    ? "documents_uploaded"
    : "password_created";
  await pool.query(
    `INSERT INTO mechanic_profiles (user_id, display_name, legal_name, application_status, account_status)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       display_name = VALUES(display_name),
       legal_name = VALUES(legal_name),
       application_status = VALUES(application_status),
       account_status = VALUES(account_status)`,
    [user.id, displayName, displayName, applicationStatus, "pending"]
  );

  return { userId: user.id, fullName: displayName };
};

const setPasswordByEmail = async ({ email, password }) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || !password) {
    throw new AppError("VALIDATION_ERROR", "email and password are required", 400);
  }
  if (password.length < 10) {
    throw new AppError("VALIDATION_ERROR", "Password must be at least 10 characters", 400);
  }
  if (!/[A-Z]/.test(password)) {
    throw new AppError("VALIDATION_ERROR", "Password must include an uppercase letter", 400);
  }
  if (!/[0-9]/.test(password)) {
    throw new AppError("VALIDATION_ERROR", "Password must include a number", 400);
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new AppError("VALIDATION_ERROR", "Password must include a symbol", 400);
  }

  const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [normalizedEmail]);
  const user = rows[0];
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }

  await ensureMechanicProfileOnboardingColumns();
  await ensureMechanicInfoRequestColumns();
  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query("UPDATE users SET password_hash = ?, status = 'active' WHERE id = ?", [passwordHash, user.id]);
  const [profileRows] = await pool.query(
    `SELECT application_status, account_status
     FROM mechanic_profiles
     WHERE user_id = ?
     LIMIT 1`,
    [user.id]
  );
  const applicationStatus = (await hasMechanicUploadedDocuments(user.id))
    ? "documents_uploaded"
    : "password_created";
  const accountStatus = resolveNextMechanicAccountStatus(profileRows[0]);
  await pool.query(
    `UPDATE mechanic_profiles
     SET application_status = ?, account_status = ?, password_set_at = NOW()
     WHERE user_id = ?`,
    [applicationStatus, accountStatus, user.id]
  );
  try {
    await sendMechanicAccountReadyEmail({
      to: normalizedEmail,
      homeUrl: `${process.env.APP_BASE_URL || "http://localhost:3000"}/`
    });
  } catch (error) {
    console.warn("Unable to send mechanic account ready email", error);
  }
  return { userId: user.id };
};

const startPasswordSetupByEmail = async ({ email, password, confirm }) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || !password || !confirm) {
    throw new AppError("VALIDATION_ERROR", "Please save your password to continue.", 400);
  }
  if (password !== confirm) {
    throw new AppError("VALIDATION_ERROR", "Passwords do not match.", 400);
  }
  if (password.length < 10) {
    throw new AppError("VALIDATION_ERROR", "Password must be at least 10 characters", 400);
  }
  if (!/[A-Z]/.test(password)) {
    throw new AppError("VALIDATION_ERROR", "Password must include an uppercase letter", 400);
  }
  if (!/[0-9]/.test(password)) {
    throw new AppError("VALIDATION_ERROR", "Password must include a number", 400);
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new AppError("VALIDATION_ERROR", "Password must include a symbol", 400);
  }

  const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [normalizedEmail]);
  const user = rows[0];
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }

  await ensureMechanicPasswordSetupTables();
  const challengeToken = crypto.randomBytes(32).toString("hex");
  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
  const codeHash = await bcrypt.hash(code, 10);
  const passwordHash = await bcrypt.hash(password, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await pool.query(
    `INSERT INTO mechanic_password_setup_challenges
     (user_id, challenge_token, code_hash, password_hash, expires_at)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       challenge_token = VALUES(challenge_token),
       code_hash = VALUES(code_hash),
       password_hash = VALUES(password_hash),
       expires_at = VALUES(expires_at),
       consumed_at = NULL`,
    [user.id, challengeToken, codeHash, passwordHash, expiresAt]
  );

  try {
    await sendMechanicSetupCodeEmail({
      to: normalizedEmail,
      code,
      expiresMinutes: 10
    });
  } catch (error) {
    await pool.query("DELETE FROM mechanic_password_setup_challenges WHERE user_id = ?", [user.id]);
    throw error;
  }

  return {
    challengeToken,
    expiresAt
  };
};

const confirmPasswordSetupByEmail = async ({ email, challengeToken, code }) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedToken = String(challengeToken || "").trim();
  const normalizedCode = String(code || "").replace(/\D+/g, "").slice(0, 6);

  if (!normalizedEmail || !normalizedToken || normalizedCode.length !== 6) {
    throw new AppError("VALIDATION_ERROR", "email, challenge_token and code are required", 400);
  }

  const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [normalizedEmail]);
  const user = rows[0];
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }

  await ensureMechanicPasswordSetupTables();
  await ensureMechanicProfileOnboardingColumns();
  await ensureMechanicInfoRequestColumns();

  const [challengeRows] = await pool.query(
    `SELECT id, code_hash, password_hash, expires_at, consumed_at
     FROM mechanic_password_setup_challenges
     WHERE user_id = ? AND challenge_token = ?
     LIMIT 1`,
    [user.id, normalizedToken]
  );
  const challenge = challengeRows[0];
  if (!challenge) {
    throw new AppError("INVALID_SETUP_CHALLENGE", "Invalid or expired verification code", 400);
  }
  if (challenge.consumed_at) {
    throw new AppError("INVALID_SETUP_CHALLENGE", "This verification code has already been used", 400);
  }
  if (new Date(challenge.expires_at).getTime() < Date.now()) {
    await pool.query("DELETE FROM mechanic_password_setup_challenges WHERE id = ?", [challenge.id]);
    throw new AppError("INVALID_SETUP_CHALLENGE", "Verification code expired", 400);
  }

  const matches = await bcrypt.compare(normalizedCode, challenge.code_hash);
  if (!matches) {
    throw new AppError("INVALID_SETUP_CODE", "Invalid verification code", 400);
  }

  await pool.query("UPDATE users SET password_hash = ?, status = 'active' WHERE id = ?", [
    challenge.password_hash,
    user.id
  ]);
  const [profileRows] = await pool.query(
    `SELECT application_status, account_status
     FROM mechanic_profiles
     WHERE user_id = ?
     LIMIT 1`,
    [user.id]
  );
  const applicationStatus = (await hasMechanicUploadedDocuments(user.id))
    ? "documents_uploaded"
    : "password_created";
  const accountStatus = resolveNextMechanicAccountStatus(profileRows[0]);
  await pool.query(
    `UPDATE mechanic_profiles
     SET application_status = ?, account_status = ?, password_set_at = NOW()
     WHERE user_id = ?`,
    [applicationStatus, accountStatus, user.id]
  );
  await pool.query("UPDATE mechanic_password_setup_challenges SET consumed_at = NOW() WHERE id = ?", [
    challenge.id
  ]);

  try {
    await sendMechanicAccountReadyEmail({
      to: normalizedEmail,
      homeUrl: `${process.env.APP_BASE_URL || "http://localhost:3000"}/`
    });
  } catch (error) {
    console.warn("Unable to send mechanic account ready email", error);
  }

  return { userId: user.id };
};

const getProfile = async (userId) => {
  await ensureMechanicInfoRequestColumns();
  await ensureUserProfileMiddleNameColumn();
  const [rows] = await pool.query(
    `SELECT u.id, u.email, u.created_at,
            p.name, p.middle_name, p.lastname, p.avatar_url,
            mp.display_name, mp.about, mp.jobs_done, mp.rating_avg, mp.is_mobile, mp.vat_id, mp.vat_registered,
            mp.years_experience, mp.work_history,
            mp.application_status, mp.account_status, mp.info_request_note, mp.info_requested_at
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     LEFT JOIN mechanic_profiles mp ON mp.user_id = u.id
     WHERE u.id = ?`,
    [userId]
  );
  const user = rows[0];
  if (!user) return null;

  const contactAddress = (await getAddressByLabel(userId, "Contact")) || (await getLatestAddress(userId));
  const premisesAddress = await getAddressByLabel(userId, "Premises");
  const qualifications = await getQualifications(userId);
  const memberships = await getMemberships(userId);
  const name = user.display_name || [user.name, user.middle_name, user.lastname].filter(Boolean).join(" ") || user.email;
  const location = contactAddress?.city || "Surrey";

  return {
    id: user.id,
    name,
    location,
    email: user.email,
    avatar_url: resolveMechanicAvatarUrl(user),
    rating: user.rating_avg || 0,
    jobs_done: user.jobs_done || 0,
    created_at: user.created_at,
    is_mobile: user.is_mobile === null ? true : Boolean(user.is_mobile),
    vat_id: user.vat_id || null,
    vat_registered: Boolean(user.vat_registered),
    years_experience: user.years_experience || null,
    work_history: user.work_history || "",
    application_status: user.application_status || null,
    account_status: user.account_status || null,
    info_request_note: user.info_request_note || "",
    info_requested_at: user.info_requested_at || null,
    address: formatAddressRow(contactAddress) || "",
    address_details: contactAddress
      ? {
          line1: contactAddress.line1 || "",
          line2: contactAddress.line2 || "",
          city: contactAddress.city || "",
          postal_code: contactAddress.postal_code || "",
          country: contactAddress.country || "GB"
        }
      : null,
    contact_address: formatAddressRow(contactAddress) || "",
    contact_address_details: contactAddress
      ? {
          line1: contactAddress.line1 || "",
          line2: contactAddress.line2 || "",
          city: contactAddress.city || "",
          postal_code: contactAddress.postal_code || "",
          country: contactAddress.country || "GB"
        }
      : null,
    premises_address: formatAddressRow(premisesAddress) || "",
    premises_address_details: premisesAddress
      ? {
          line1: premisesAddress.line1 || "",
          line2: premisesAddress.line2 || "",
          city: premisesAddress.city || "",
          postal_code: premisesAddress.postal_code || "",
          country: premisesAddress.country || "GB"
        }
      : null,
    qualifications,
    memberships
  };
};

const getOnboardingByEmail = async (email) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return null;

  await ensureMechanicProfileOnboardingColumns();
  await ensureMechanicInfoRequestColumns();

  const [rows] = await pool.query(
    `SELECT u.id, u.email, mp.application_status, mp.account_status, mp.info_request_note, mp.info_requested_at
     FROM users u
     LEFT JOIN mechanic_profiles mp ON mp.user_id = u.id
     WHERE u.email = ?
     LIMIT 1`,
    [normalizedEmail]
  );
  const row = rows[0];
  if (!row) return null;
  return {
    userId: row.id,
    email: row.email,
    application_status: row.application_status || null,
    account_status: row.account_status || null,
    info_request_note: row.info_request_note || "",
    info_requested_at: row.info_requested_at || null
  };
};

module.exports = {
  getProfile,
  getOnboardingByEmail,
  addQualification,
  updateProfile,
  saveApplication,
  saveUploadedDocumentsByEmail,
  listMechanicDocumentsByUserId,
  completeApplication,
  setPasswordByEmail,
  startPasswordSetupByEmail,
  confirmPasswordSetupByEmail
};
