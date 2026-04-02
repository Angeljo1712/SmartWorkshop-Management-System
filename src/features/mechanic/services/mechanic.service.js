const { pool } = require("../../../shared/config/pool");
const { AppError } = require("../../../shared/utils/appError");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
  const [result] = await pool.query(
    "INSERT INTO users (uuid_public, email, username, password_hash, role, status, phone) VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?, ?)",
    [normalizedEmail, username, passwordHash, "user", "active", phone || null]
  );
  const userId = result.insertId;
  await pool.query(
    "INSERT INTO user_profiles (user_id, name, lastname) VALUES (?, ?, ?)",
    [userId, firstName || "-", lastName || "-"]
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
       AND COLUMN_NAME IN ('application_type', 'lead_postcode', 'application_status', 'account_status', 'password_set_at')`
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

  await pool.query(
    `INSERT INTO mechanic_profiles
     (user_id, display_name, legal_name, years_experience, work_history, website_url,
      has_trade_insurance, has_public_liability, vat_registered, business_type, application_type, lead_postcode,
      application_status, account_status,
      travel_radius_miles, availability_pref, referral_source)
     VALUES (?, '-', '-', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
       account_status = COALESCE(mechanic_profiles.account_status, VALUES(account_status)),
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
      "lead_created",
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

  return { userId: user.id, count: files.length };
};

const completeApplication = async ({ email }) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) {
    throw new AppError("VALIDATION_ERROR", "email is required", 400);
  }

  const [rows] = await pool.query(
    `SELECT u.id, u.email, p.name, p.lastname
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

  const displayName = [user.name, user.lastname].filter(Boolean).join(" ") || user.email;
  await pool.query(
    `INSERT INTO mechanic_profiles (user_id, display_name, legal_name, application_status, account_status)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       display_name = VALUES(display_name),
       legal_name = VALUES(legal_name),
       application_status = VALUES(application_status),
       account_status = VALUES(account_status)`,
    [user.id, displayName, displayName, "documents_uploaded", "password_pending"]
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
  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query("UPDATE users SET password_hash = ?, status = 'active' WHERE id = ?", [passwordHash, user.id]);
  await pool.query(
    `UPDATE mechanic_profiles
     SET application_status = ?, account_status = ?, password_set_at = NOW()
     WHERE user_id = ?`,
    ["password_created", "active", user.id]
  );
  return { userId: user.id };
};

const getProfile = async (userId) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.email, u.created_at,
            p.name, p.lastname, p.avatar_url,
            mp.display_name, mp.about, mp.jobs_done, mp.rating_avg, mp.is_mobile, mp.vat_id,
            mp.years_experience, mp.work_history
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     LEFT JOIN mechanic_profiles mp ON mp.user_id = u.id
     WHERE u.id = ?`,
    [userId]
  );
  const user = rows[0];
  if (!user) return null;

  const address = await getLatestAddress(userId);
  const qualifications = await getQualifications(userId);
  const memberships = await getMemberships(userId);
  const name = user.display_name || [user.name, user.lastname].filter(Boolean).join(" ") || user.email;
  const location = address?.city || "Surrey";

  return {
    id: user.id,
    name,
    location,
    email: user.email,
    avatar_url: user.avatar_url,
    rating: user.rating_avg || 0,
    jobs_done: user.jobs_done || 0,
    created_at: user.created_at,
    is_mobile: user.is_mobile === null ? true : Boolean(user.is_mobile),
    vat_id: user.vat_id || null,
    years_experience: user.years_experience || null,
    work_history: user.work_history || "",
    address,
    qualifications,
    memberships
  };
};

module.exports = {
  getProfile,
  addQualification,
  updateProfile,
  saveApplication,
  saveUploadedDocumentsByEmail,
  completeApplication,
  setPasswordByEmail
};
