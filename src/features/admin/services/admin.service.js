const { pool } = require("../../../shared/config/pool");
const { AppError } = require("../../../shared/utils/appError");
const { issueInvoiceForBooking } = require("../../invoices/services/invoices.service");
const { getResolutionCaseAttachmentsByMessageIds } = require("../../resolution/services/resolutionAttachment.service");

const formatBookingReference = (value) => String(Number(value) || 0).padStart(8, "0");

const listWorkshops = async () => {
  const [rows] = await pool.query("SELECT * FROM workshops ORDER BY created_at DESC");
  return rows;
};

const createWorkshop = async (payload) => {
  const { name, address, postcode, phone, description } = payload;
  if (!name || !address || !postcode || !phone) {
    throw new AppError("VALIDATION_ERROR", "name, address, postcode, phone are required", 400);
  }
  const [result] = await pool.query(
    "INSERT INTO workshops (name, address, postcode, phone, description) VALUES (?, ?, ?, ?, ?)",
    [name, address, postcode, phone, description || null]
  );
  const [rows] = await pool.query("SELECT * FROM workshops WHERE workshop_id = ?", [result.insertId]);
  return rows[0];
};

const updateWorkshop = async (workshopId, payload) => {
  const fields = ["name", "address", "postcode", "phone", "description"];
  const updates = fields.filter((field) => payload[field] !== undefined);
  if (updates.length === 0) {
    throw new AppError("VALIDATION_ERROR", "No fields to update", 400);
  }

  const setClause = updates.map((field) => `${field} = ?`).join(", ");
  const values = updates.map((field) => payload[field]);
  values.push(workshopId);

  await pool.query(`UPDATE workshops SET ${setClause} WHERE workshop_id = ?`, values);
  const [rows] = await pool.query("SELECT * FROM workshops WHERE workshop_id = ?", [workshopId]);
  return rows[0];
};

const deleteWorkshop = async (workshopId) => {
  await pool.query("DELETE FROM workshops WHERE workshop_id = ?", [workshopId]);
  return { deleted: true };
};

const ensureMechanicProfileWorkflowColumns = async () => {
  const [rows] = await pool.query(
    `SELECT COLUMN_NAME
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'mechanic_profiles'
       AND COLUMN_NAME IN ('application_type', 'lead_postcode', 'application_status', 'account_status', 'password_set_at', 'info_request_note', 'info_requested_at')`
  );

  const existing = new Set(rows.map((row) => row.COLUMN_NAME));

  if (!existing.has('application_type')) {
    await pool.query("ALTER TABLE mechanic_profiles ADD COLUMN application_type VARCHAR(64) NULL AFTER business_type");
  }
  if (!existing.has('lead_postcode')) {
    await pool.query("ALTER TABLE mechanic_profiles ADD COLUMN lead_postcode VARCHAR(16) NULL AFTER application_type");
  }
  if (!existing.has('application_status')) {
    await pool.query("ALTER TABLE mechanic_profiles ADD COLUMN application_status VARCHAR(64) NULL AFTER lead_postcode");
  }
  if (!existing.has('account_status')) {
    await pool.query("ALTER TABLE mechanic_profiles ADD COLUMN account_status VARCHAR(64) NULL AFTER application_status");
  }
  if (!existing.has('password_set_at')) {
    await pool.query("ALTER TABLE mechanic_profiles ADD COLUMN password_set_at DATETIME NULL AFTER account_status");
  }
  if (!existing.has('info_request_note')) {
    await pool.query("ALTER TABLE mechanic_profiles ADD COLUMN info_request_note TEXT NULL AFTER account_status");
  }
  if (!existing.has('info_requested_at')) {
    await pool.query("ALTER TABLE mechanic_profiles ADD COLUMN info_requested_at DATETIME NULL AFTER info_request_note");
  }
};

let paymentAdminNotesTableReady = false;
const ensurePaymentAdminNotesTable = async () => {
  if (paymentAdminNotesTableReady) return;
  await pool.query(
    `CREATE TABLE IF NOT EXISTS payment_admin_notes (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      payment_kind VARCHAR(32) NOT NULL,
      record_id BIGINT UNSIGNED NOT NULL,
      admin_id BIGINT UNSIGNED NOT NULL,
      note TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      KEY idx_payment_admin_notes_lookup (payment_kind, record_id, created_at),
      KEY idx_payment_admin_notes_admin (admin_id, created_at),
      CONSTRAINT fk_payment_admin_notes_admin FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`
  );
  paymentAdminNotesTableReady = true;
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

let resolutionCaseStatusEnumReady = false;
const ensureResolutionCaseInProgressStatus = async () => {
  if (resolutionCaseStatusEnumReady) return;
  const [rows] = await pool.query(
    `SELECT COLUMN_TYPE
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'resolution_cases'
       AND COLUMN_NAME = 'status'
     LIMIT 1`
  );
  const columnType = String(rows?.[0]?.COLUMN_TYPE || "").toLowerCase();
  if (!columnType.includes("'in_progress'")) {
    await pool.query(
      "ALTER TABLE resolution_cases MODIFY COLUMN status ENUM('open','in_progress','closed') NOT NULL DEFAULT 'open'"
    );
  }
  resolutionCaseStatusEnumReady = true;
};

const roleLabel = (role) => {
  const normalized = String(role || "").toLowerCase();
  if (normalized === "user") return "CUSTOMER";
  if (normalized === "mechanic") return "MECHANIC";
  if (normalized === "admin") return "ADMIN";
  return String(role || "").toUpperCase();
};

const collapseRepeatedNameParts = (value) => {
  const tokens = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!tokens.length) return "";

  let changed = true;
  while (changed) {
    changed = false;
    for (let size = Math.floor(tokens.length / 2); size >= 1; size -= 1) {
      const tail = tokens.slice(-size).join(" ").toLowerCase();
      const previous = tokens.slice(-size * 2, -size).join(" ").toLowerCase();
      if (tail && tail === previous) {
        tokens.splice(tokens.length - size * 2, size);
        changed = true;
        break;
      }
    }
  }

  return tokens.join(" ").trim();
};

const buildDisplayName = ({ name, middle_name, lastname, full_name, email }, fallback = "User") => {
  const joined = [name, middle_name, lastname].filter(Boolean).join(" ").trim();
  return collapseRepeatedNameParts(full_name || joined || email || fallback);
};

const normalizeAddressPayload = (payload) => {
  if (payload === null || payload === undefined) return null;
  if (typeof payload === "object" && !Array.isArray(payload)) {
    const line1 = String(payload.line1 || "").trim();
    const line2 = String(payload.line2 || "").trim();
    const city = String(payload.city || "").trim();
    const postal_code = String(payload.postal_code || "").trim();
    const country = String(payload.country || "GB").trim() || "GB";
    if (!line1 && !city && !postal_code) return null;
    return { line1, line2, city, postal_code, country };
  }

  const text = String(payload || "").trim();
  if (!text) return null;
  const parts = text.split(",").map((part) => String(part || "").trim()).filter(Boolean);
  while (parts.length > 1 && /^gb$/i.test(parts[parts.length - 1]) && /^gb$/i.test(parts[parts.length - 2])) {
    parts.pop();
  }
  if (parts.length >= 4) {
    return {
      line1: parts.slice(0, Math.max(1, parts.length - 3)).join(", "),
      line2: parts[parts.length - 3] || "",
      city: parts[parts.length - 2] || "",
      postal_code: parts[parts.length - 1] || "",
      country: "GB"
    };
  }
  return { line1: text, line2: "", city: "", postal_code: "", country: "GB" };
};

const listUsers = async () => {
  await ensureUserProfileMiddleNameColumn();
  const [rows] = await pool.query(
    `SELECT u.id, u.email, u.username, u.phone, u.created_at, u.role, u.status,
            p.name, p.middle_name, p.lastname, p.avatar_url,
            a.line1,
            a.line2,
            a.city,
            a.postal_code,
            a.country,
            ur.roles
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     LEFT JOIN (
       SELECT user_id, GROUP_CONCAT(role) AS roles
       FROM user_roles
       GROUP BY user_id
     ) ur ON ur.user_id = u.id
     LEFT JOIN (
       SELECT a1.user_id, a1.line1, a1.line2, a1.city, a1.postal_code, a1.country
       FROM addresses a1
       INNER JOIN (
         SELECT user_id, MAX(id) AS latest_address_id
         FROM addresses
         GROUP BY user_id
       ) latest_address ON latest_address.latest_address_id = a1.id
     ) a ON a.user_id = u.id
     ORDER BY u.created_at DESC`
  );
  return rows.map((row) => {
    const roles = (row.roles ? String(row.roles).split(",") : [row.role]).map(roleLabel);
    const primaryRole = roles.includes("ADMIN")
      ? "ADMIN"
      : roles.includes("MECHANIC")
        ? "MECHANIC"
        : "CUSTOMER";
    return {
      user_id: row.id,
      name: row.name || "",
      middle_name: row.middle_name || "",
      lastname: row.lastname || "",
      full_name: buildDisplayName(row, "-") || "-",
      email: row.email,
      username: row.username,
      status: row.status || "active",
      last_active: row.created_at,
      role_name: primaryRole,
      roles,
      created_at: row.created_at,
      avatar_url: row.avatar_url,
      phone: row.phone,
      address: [row.line1, row.line2, row.city, row.postal_code, row.country].filter(Boolean).join(", ") || "",
      address_line_1: row.line1 || "",
      address_line_2: row.line2 || "",
      city: row.city || "",
      postal_code: row.postal_code || "",
      country: row.country || ""
    };
  });
};

const listApplications = async () => {
  await ensureMechanicProfileWorkflowColumns();
  await ensureUserProfileMiddleNameColumn();
  const [rows] = await pool.query(
    `SELECT u.id,
            u.email,
            u.phone,
            u.status AS user_status,
            u.created_at,
            p.name,
            p.middle_name,
            p.lastname,
            mp.application_type,
            mp.business_type,
            mp.lead_postcode,
            mp.application_status,
            mp.account_status,
            mp.info_request_note,
            mp.info_requested_at,
            mp.password_set_at,
            COUNT(md.id) AS documents_count
     FROM users u
     INNER JOIN mechanic_profiles mp ON mp.user_id = u.id
     LEFT JOIN user_profiles p ON p.user_id = u.id
     LEFT JOIN mechanic_documents md ON md.user_id = u.id
     GROUP BY u.id
     ORDER BY u.created_at DESC`
  );

  return rows.map((row) => ({
    user_id: row.id,
    full_name: buildDisplayName(row, row.email),
    email: row.email,
    phone: row.phone || "",
    created_at: row.created_at,
    lead_postcode: row.lead_postcode || "",
    application_type: row.application_type || "",
    business_type: row.business_type || "",
    application_status: row.application_status || "unknown",
    account_status: row.account_status || "unknown",
    info_request_note: row.info_request_note || "",
    info_requested_at: row.info_requested_at || null,
    user_status: row.user_status || "pending",
    documents_count: Number(row.documents_count || 0),
    password_set_at: row.password_set_at || null
  }));
};

const listApplicationDocuments = async (userId) => {
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

const updateApplicationStatus = async ({ userId, action, note }) => {
  await ensureMechanicProfileWorkflowColumns();
  const normalizedAction = String(action || "").trim().toLowerCase();
  const statesByAction = {
    approve: {
      application_status: "approved",
      account_status: "active",
      user_status: "active"
    },
    request_info: {
      application_status: "info_requested",
      account_status: "pending",
      user_status: "pending"
    },
    reject: {
      application_status: "rejected",
      account_status: "rejected",
      user_status: "suspended"
    }
  };

  const nextState = statesByAction[normalizedAction];
  if (!nextState) {
    throw new AppError("APPLICATION_ACTION_INVALID", "Application action not supported", 400);
  }

  const infoRequestNote = normalizedAction === "request_info" ? String(note || "").trim() : "";
  await pool.query(
    `UPDATE mechanic_profiles
     SET application_status = ?, account_status = ?, info_request_note = ?, info_requested_at = ?
     WHERE user_id = ?`,
    [
      nextState.application_status,
      nextState.account_status,
      infoRequestNote || null,
      normalizedAction === "request_info" ? new Date() : null,
      userId
    ]
  );

  await pool.query("UPDATE users SET status = ? WHERE id = ?", [nextState.user_status, userId]);

  const applications = await listApplications();
  return applications.find((item) => Number(item.user_id) === Number(userId)) || null;
};

const listBookings = async () => {
  const [rows] = await pool.query(
    `SELECT b.id,
            b.status,
            b.total_eur,
            b.created_at,
            customer.email AS customer_email,
            customer_profile.name AS customer_name,
            customer_profile.lastname AS customer_lastname,
            mechanic.email AS mechanic_email,
            mechanic_profile.name AS mechanic_name,
            mechanic_profile.lastname AS mechanic_lastname,
            v.license_plate,
            v.make,
            v.model,
            a.city,
            a.postal_code,
            GROUP_CONCAT(sc.name ORDER BY sc.name SEPARATOR ' | ') AS services
     FROM bookings b
     LEFT JOIN users customer ON customer.id = b.customer_id
     LEFT JOIN user_profiles customer_profile ON customer_profile.user_id = customer.id
     LEFT JOIN users mechanic ON mechanic.id = b.mechanic_id
     LEFT JOIN user_profiles mechanic_profile ON mechanic_profile.user_id = mechanic.id
     LEFT JOIN vehicles v ON v.id = b.vehicle_id
     LEFT JOIN addresses a ON a.id = b.address_id
     LEFT JOIN booking_items bi ON bi.booking_id = b.id
     LEFT JOIN service_catalog sc ON sc.id = bi.service_id
     GROUP BY b.id
     ORDER BY b.created_at DESC`
  );

  return rows.map((row) => ({
    booking_id: row.id,
    reference: String(row.id).padStart(8, "0"),
    status: row.status || "requested",
    total: Number(row.total_eur || 0),
    created_at: row.created_at,
    customer_name: [row.customer_name, row.customer_middle_name, row.customer_lastname].filter(Boolean).join(" ") || row.customer_email || "-",
    mechanic_name: [row.mechanic_name, row.mechanic_middle_name, row.mechanic_lastname].filter(Boolean).join(" ") || row.mechanic_email || "Unassigned",
    vehicle: [row.make, row.model, row.license_plate].filter(Boolean).join(" · ") || "-",
    location: [row.city, row.postal_code].filter(Boolean).join(" ") || "-",
    services: row.services || "-"
  }));
};

const updateBookingStatus = async ({ bookingId, action }) => {
  const normalizedAction = String(action || "").trim().toLowerCase();
  const statusByAction = {
    start: "in_progress",
    complete: "completed",
    cancel: "cancelled",
    dispute: "disputed"
  };
  const nextStatus = statusByAction[normalizedAction];
  if (!nextStatus) {
    throw new AppError("BOOKING_ACTION_INVALID", "Booking action not supported", 400);
  }

  await pool.query("UPDATE bookings SET status = ? WHERE id = ?", [nextStatus, bookingId]);
  if (nextStatus === "completed") {
    await issueInvoiceForBooking(bookingId);
  }
  const bookings = await listBookings();
  return bookings.find((item) => Number(item.booking_id) === Number(bookingId)) || null;
};

const listResolutionCases = async () => {
  await ensureResolutionCaseInProgressStatus();
  const [rows] = await pool.query(
    `SELECT rc.id,
            rc.booking_id,
            rc.case_type,
            rc.subject,
            rc.reference,
            rc.status,
            rc.updated_at,
            customer.email AS customer_email,
            customer_profile.name AS customer_name,
            customer_profile.middle_name AS customer_middle_name,
            customer_profile.lastname AS customer_lastname,
            mechanic.email AS mechanic_email,
            mechanic_profile.name AS mechanic_name,
            mechanic_profile.middle_name AS mechanic_middle_name,
            mechanic_profile.lastname AS mechanic_lastname
     FROM resolution_cases rc
     INNER JOIN users customer ON customer.id = rc.customer_id
     LEFT JOIN user_profiles customer_profile ON customer_profile.user_id = customer.id
     INNER JOIN users mechanic ON mechanic.id = rc.mechanic_id
     LEFT JOIN user_profiles mechanic_profile ON mechanic_profile.user_id = mechanic.id
     ORDER BY rc.updated_at DESC`
  );

  return rows.map((row) => ({
    case_id: row.id,
    booking_id: row.booking_id,
    type: row.case_type || "general",
    subject: row.subject || "",
    reference: row.reference || `${String(row.booking_id).padStart(8, "0")}/1`,
    status: row.status || "open",
    updated_at: row.updated_at,
    customer_name: [row.customer_name, row.customer_middle_name, row.customer_lastname].filter(Boolean).join(" ") || row.customer_email || "-",
    mechanic_name: [row.mechanic_name, row.mechanic_middle_name, row.mechanic_lastname].filter(Boolean).join(" ") || row.mechanic_email || "-"
  }));
};

const updateResolutionCaseStatus = async ({ caseId, action }) => {
  await ensureResolutionCaseInProgressStatus();
  const normalizedAction = String(action || "").trim().toLowerCase();
  const statusByAction = {
    in_progress: "in_progress",
    close: "closed",
    resolve: "closed",
    reopen: "open"
  };
  const nextStatus = statusByAction[normalizedAction];
  if (!nextStatus) {
    throw new AppError("RESOLUTION_ACTION_INVALID", "Resolution action not supported", 400);
  }

  await pool.query("UPDATE resolution_cases SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [nextStatus, caseId]);
  const cases = await listResolutionCases();
  return cases.find((item) => Number(item.case_id) === Number(caseId)) || null;
};

const getResolutionCaseDetail = async (caseId) => {
  const id = Number(caseId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("VALIDATION_ERROR", "caseId is invalid", 400);
  }

  const [rows] = await pool.query(
    `SELECT rc.id, rc.booking_id, rc.case_type, rc.subject, rc.reference, rc.status, rc.updated_at,
            rc.customer_id, rc.mechanic_id,
            b.total_eur, b.created_at,
            v.license_plate, v.make, v.model, v.year,
            a.line1, a.line2, a.city, a.postal_code, a.country,
            customer.email AS customer_email,
            customer_profile.name AS customer_name,
            customer_profile.middle_name AS customer_middle_name,
            customer_profile.lastname AS customer_lastname,
            mechanic.email AS mechanic_email,
            mechanic_profile.name AS mechanic_name,
            mechanic_profile.middle_name AS mechanic_middle_name,
            mechanic_profile.lastname AS mechanic_lastname
     FROM resolution_cases rc
     INNER JOIN bookings b ON b.id = rc.booking_id
     INNER JOIN users customer ON customer.id = rc.customer_id
     LEFT JOIN user_profiles customer_profile ON customer_profile.user_id = customer.id
     LEFT JOIN users mechanic ON mechanic.id = COALESCE(rc.mechanic_id, b.mechanic_id)
     LEFT JOIN user_profiles mechanic_profile ON mechanic_profile.user_id = mechanic.id
     LEFT JOIN addresses a ON a.id = b.address_id
     LEFT JOIN vehicles v ON v.id = b.vehicle_id
     WHERE rc.id = ?
     LIMIT 1`,
    [id]
  );
  const row = rows[0];
  if (!row) {
    throw new AppError("NOT_FOUND", "Resolution case not found", 404);
  }

  const [itemRows] = await pool.query(
    `SELECT sc.name, bi.labour_minutes, bi.line_total_eur
     FROM booking_items bi
     INNER JOIN service_catalog sc ON sc.id = bi.service_id
     WHERE bi.booking_id = ?`,
    [row.booking_id]
  );
  const [messageRows] = await pool.query(
    `SELECT rcm.id, rcm.body, rcm.created_at, rcm.sender_id,
            up.name, up.middle_name, up.lastname, up.avatar_url, u.email
     FROM resolution_case_messages rcm
     INNER JOIN users u ON u.id = rcm.sender_id
     LEFT JOIN user_profiles up ON up.user_id = rcm.sender_id
     WHERE rcm.case_id = ?
     ORDER BY rcm.created_at ASC`,
    [id]
  );
  const attachmentMap = await getResolutionCaseAttachmentsByMessageIds(messageRows.map((message) => message.id));
  const mechanicId = Number(row.mechanic_id || 0);
  const customerId = Number(row.customer_id || 0);

  return {
    id: row.id,
    booking_id: row.booking_id,
    type: row.case_type || "general",
    subject: row.subject || "",
    reference: row.reference || `${formatBookingReference(row.booking_id)}/1`,
    status: row.status || "open",
    updated_at: row.updated_at,
    booking: {
      id: row.booking_id,
      reference: formatBookingReference(row.booking_id),
      total_eur: Number(row.total_eur || 0),
      created_at: row.created_at
    },
    customer: {
      id: customerId,
      name: [row.customer_name, row.customer_middle_name, row.customer_lastname].filter(Boolean).join(" ") || row.customer_email || "Customer",
      email: row.customer_email || ""
    },
    mechanic: {
      id: mechanicId,
      name: [row.mechanic_name, row.mechanic_middle_name, row.mechanic_lastname].filter(Boolean).join(" ") || row.mechanic_email || "Mechanic",
      email: row.mechanic_email || ""
    },
    vehicle: {
      registrationNumber: row.license_plate || "",
      make: row.make || "",
      model: row.model || "",
      yearOfManufacture: row.year || null
    },
    address: {
      line1: row.line1 || "",
      line2: row.line2 || "",
      city: row.city || "",
      postal_code: row.postal_code || "",
      country: row.country || ""
    },
    items: itemRows.map((item) => ({
      name: item.name,
      labour_minutes: item.labour_minutes,
      line_total_eur: Number(item.line_total_eur || 0)
    })),
    messages: messageRows.map((message) => ({
      id: message.id,
      body: message.body,
      created_at: message.created_at,
      sender_id: message.sender_id,
    sender_name: buildDisplayName(message, message.email || "User"),
      avatar_url: message.avatar_url || "",
      sender_role:
        Number(message.sender_id) === customerId
          ? "customer"
          : Number(message.sender_id) === mechanicId
            ? "mechanic"
            : "admin",
      attachments: (attachmentMap.get(message.id) || []).map((attachment) => ({
        file_url: attachment.file_url,
        original_name: attachment.original_name || "",
        mime_type: attachment.mime_type || ""
      }))
    }))
  };
};

const addResolutionCaseMessage = async ({ adminId, caseId, body }) => {
  const text = String(body || "").trim();
  if (!text) {
    throw new AppError("VALIDATION_ERROR", "message is required", 400);
  }
  await getResolutionCaseDetail(caseId);
  await pool.query("INSERT INTO resolution_case_messages (case_id, sender_id, body) VALUES (?, ?, ?)", [
    Number(caseId),
    adminId,
    text
  ]);
  await pool.query("UPDATE resolution_cases SET updated_at = CURRENT_TIMESTAMP WHERE id = ?", [Number(caseId)]);
  return getResolutionCaseDetail(caseId);
};

const getDashboardSummary = async () => {
  await ensureMechanicProfileWorkflowColumns();
  const [[bookingsTodayRow]] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM bookings
     WHERE DATE(created_at) = CURDATE()`
  );

  const [[openCasesRow]] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM resolution_cases
     WHERE status = 'open'`
  );

  const [[pendingApplicationsRow]] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM mechanic_profiles
     WHERE COALESCE(account_status, '') <> 'active'`
  );

  const [[pendingPayoutsRow]] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM payouts
     WHERE status IN ('requested', 'processing')`
  );

  return {
    bookings_today: Number(bookingsTodayRow?.count || 0),
    open_cases: Number(openCasesRow?.count || 0),
    pending_applications: Number(pendingApplicationsRow?.count || 0),
    pending_payouts: Number(pendingPayoutsRow?.count || 0)
  };
};

const listContactMessages = async () => {
  const [rows] = await pool.query(
    `SELECT id,
            name,
            email,
            subject,
            message,
            status,
            source,
            ip_address,
            created_at
     FROM contact_messages
     ORDER BY created_at DESC`
  );

  return rows.map((row) => ({
    contact_message_id: Number(row.id),
    name: row.name || "",
    email: row.email || "",
    subject: row.subject || "",
    message: row.message || "",
    status: row.status || "new",
    source: row.source || "home_web",
    ip_address: row.ip_address || null,
    created_at: row.created_at || null
  }));
};

const updateContactMessageStatus = async ({ messageId, action }) => {
  const normalizedAction = String(action || "").trim().toLowerCase();
  const statusByAction = {
    open: "new",
    reopen: "new",
    pending: "in_progress",
    read: "in_progress",
    close: "closed",
    resolve: "closed"
  };
  const nextStatus = statusByAction[normalizedAction];

  if (!nextStatus) {
    const error = new Error("Unsupported contact message action.");
    error.status = 400;
    throw error;
  }

  await pool.query(
    "UPDATE contact_messages SET status = ? WHERE id = ?",
    [nextStatus, messageId]
  );

  const [[row]] = await pool.query(
    `SELECT id,
            name,
            email,
            subject,
            message,
            status,
            source,
            ip_address,
            created_at
     FROM contact_messages
     WHERE id = ?
     LIMIT 1`,
    [messageId]
  );

  if (!row) {
    const error = new Error("Contact message not found.");
    error.status = 404;
    throw error;
  }

  return {
    contact_message_id: Number(row.id),
    name: row.name || "",
    email: row.email || "",
    subject: row.subject || "",
    message: row.message || "",
    status: row.status || "new",
    source: row.source || "home_web",
    ip_address: row.ip_address || null,
    created_at: row.created_at || null
  };
};

const normaliseCardBrand = (value) => {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "-";
  if (text.includes("american express") || text.includes("amex")) return "American Express";
  if (text.includes("mastercard") || text.includes("master card")) return "Mastercard";
  if (text.includes("visa")) return "Visa";
  return String(value || "").trim();
};

const normalisePaymentType = (value) => {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "credit_card";
  if (text.includes("debit")) return "debit_card";
  if (text.includes("credit")) return "credit_card";
  if (text.includes("visa") || text.includes("master") || text.includes("amex") || text.includes("american express")) {
    return "credit_card";
  }
  return "credit_card";
};

const listPayments = async () => {
  const [customerPayments] = await pool.query(
    `SELECT p.id,
            p.booking_id,
            p.provider,
            p.payment_method,
            p.status,
            p.amount_eur,
            p.currency,
            p.provider_ref,
            p.created_at,
            customer.email AS customer_email,
            customer_profile.name AS customer_name,
            customer_profile.middle_name AS customer_middle_name,
            customer_profile.lastname AS customer_lastname
     FROM payments p
     INNER JOIN bookings b ON b.id = p.booking_id
     INNER JOIN users customer ON customer.id = b.customer_id
     LEFT JOIN user_profiles customer_profile ON customer_profile.user_id = customer.id
     ORDER BY p.created_at DESC`
  );

  const [invoiceBackfillRows] = await pool.query(
    `SELECT inv.id,
            inv.number AS invoice_number,
            inv.booking_id,
            inv.issued_at,
            b.total_eur,
            customer.email AS customer_email,
            customer_profile.name AS customer_name,
            customer_profile.middle_name AS customer_middle_name,
            customer_profile.lastname AS customer_lastname
     FROM invoices inv
     INNER JOIN bookings b ON b.id = inv.booking_id
     INNER JOIN users customer ON customer.id = b.customer_id
     LEFT JOIN user_profiles customer_profile ON customer_profile.user_id = customer.id
     LEFT JOIN payments p ON p.booking_id = inv.booking_id
     WHERE p.id IS NULL
     ORDER BY inv.issued_at DESC`
  );

  const [payoutRows] = await pool.query(
    `SELECT po.id,
            po.amount_eur,
            po.status,
            po.provider_ref,
            po.created_at,
            mechanic.email AS mechanic_email,
            mechanic_profile.name AS mechanic_name,
            mechanic_profile.middle_name AS mechanic_middle_name,
            mechanic_profile.lastname AS mechanic_lastname
     FROM payouts po
     INNER JOIN wallets w ON w.id = po.wallet_id
     INNER JOIN users mechanic ON mechanic.id = w.mechanic_id
     LEFT JOIN user_profiles mechanic_profile ON mechanic_profile.user_id = mechanic.id
     ORDER BY po.created_at DESC`
  );

  const paymentItems = customerPayments.map((row) => ({
    record_id: row.id,
    kind: "customer_payment",
    reference: `PAY-${row.id}`,
    booking_reference: String(row.booking_id).padStart(8, "0"),
    party: [row.customer_name, row.customer_middle_name, row.customer_lastname].filter(Boolean).join(" ") || row.customer_email || "-",
    provider: row.provider || "-",
    provider_brand: normaliseCardBrand(row.payment_method || row.provider),
    payment_type: normalisePaymentType(row.payment_method),
    status: row.status || "authorized",
    amount: Number(row.amount_eur || 0),
    currency: row.currency || "GBP",
    created_at: row.created_at
  }));

  const invoiceBackfillItems = invoiceBackfillRows.map((row) => ({
    record_id: row.id,
    kind: "invoiced_payment",
    reference: row.invoice_number || `INV-${String(row.booking_id || "").padStart(8, "0")}`,
    booking_reference: String(row.booking_id).padStart(8, "0"),
    party: [row.customer_name, row.customer_middle_name, row.customer_lastname].filter(Boolean).join(" ") || row.customer_email || "-",
    provider: "Invoice",
    provider_brand: null,
    payment_type: "credit_card",
    status: "completed",
    amount: Number(row.total_eur || 0),
    currency: "GBP",
    created_at: row.issued_at || null
  }));

  const payoutItems = payoutRows.map((row) => ({
    record_id: row.id,
    kind: "mechanic_payout",
    reference: `PAYOUT-${row.id}`,
    booking_reference: "-",
    party: [row.mechanic_name, row.mechanic_middle_name, row.mechanic_lastname].filter(Boolean).join(" ") || row.mechanic_email || "-",
    provider: row.provider_ref || "-",
    provider_brand: null,
    payment_type: "-",
    status: row.status || "requested",
    amount: Number(row.amount_eur || 0),
    currency: "GBP",
    created_at: row.created_at
  }));

  return [...paymentItems, ...invoiceBackfillItems, ...payoutItems].sort((a, b) => {
    const left = Number.isFinite(new Date(a.created_at).getTime()) ? new Date(a.created_at).getTime() : 0;
    const right = Number.isFinite(new Date(b.created_at).getTime()) ? new Date(b.created_at).getTime() : 0;
    return right - left;
  });
};

const updatePaymentStatus = async ({ kind, recordId, action }) => {
  const normalizedKind = String(kind || "").trim().toLowerCase();
  const normalizedAction = String(action || "").trim().toLowerCase();

  if (normalizedKind === "customer_payment") {
    const statusByAction = {
      capture: "auth_captured",
      refund: "refunded",
      fail: "failed"
    };
    const nextStatus = statusByAction[normalizedAction];
    if (!nextStatus) {
      throw new AppError("PAYMENT_ACTION_INVALID", "Payment action not supported", 400);
    }
    await pool.query("UPDATE payments SET status = ? WHERE id = ?", [nextStatus, recordId]);
  } else if (normalizedKind === "mechanic_payout") {
    const statusByAction = {
      process: "processing",
      pay: "paid",
      fail: "failed"
    };
    const nextStatus = statusByAction[normalizedAction];
    if (!nextStatus) {
      throw new AppError("PAYOUT_ACTION_INVALID", "Payout action not supported", 400);
    }
    await pool.query("UPDATE payouts SET status = ? WHERE id = ?", [nextStatus, recordId]);
  } else {
    throw new AppError("PAYMENT_KIND_INVALID", "Payment kind not supported", 400);
  }

  const payments = await listPayments();
  return payments.find(
    (item) => String(item.kind || "").trim().toLowerCase() === normalizedKind && Number(item.record_id) === Number(recordId)
  ) || null;
};

const getPaymentDetail = async ({ kind, recordId }) => {
  await ensurePaymentAdminNotesTable();
  const normalizedKind = String(kind || "").trim().toLowerCase();
  const id = Number(recordId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("VALIDATION_ERROR", "recordId is invalid", 400);
  }
  const payments = await listPayments();
  const payment = payments.find(
    (item) => String(item.kind || "").trim().toLowerCase() === normalizedKind && Number(item.record_id) === id
  );
  if (!payment) {
    throw new AppError("NOT_FOUND", "Payment not found", 404);
  }

  const [notesRows] = await pool.query(
    `SELECT pan.id, pan.note, pan.created_at, pan.admin_id,
            up.name, up.middle_name, up.lastname, u.email
     FROM payment_admin_notes pan
     INNER JOIN users u ON u.id = pan.admin_id
     LEFT JOIN user_profiles up ON up.user_id = pan.admin_id
     WHERE pan.payment_kind = ? AND pan.record_id = ?
     ORDER BY pan.created_at DESC`,
    [normalizedKind, id]
  );

  return {
    ...payment,
    notes: notesRows.map((row) => ({
      id: Number(row.id),
      note: row.note || "",
      created_at: row.created_at,
      admin_id: Number(row.admin_id),
      admin_name: [row.name, row.middle_name, row.lastname].filter(Boolean).join(" ") || row.email || "Admin"
    }))
  };
};

const addPaymentAdminNote = async ({ adminId, kind, recordId, note }) => {
  await ensurePaymentAdminNotesTable();
  const normalizedKind = String(kind || "").trim().toLowerCase();
  const id = Number(recordId);
  const text = String(note || "").trim();
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("VALIDATION_ERROR", "recordId is invalid", 400);
  }
  if (!text) {
    throw new AppError("VALIDATION_ERROR", "note is required", 400);
  }
  if (text.length > 2000) {
    throw new AppError("VALIDATION_ERROR", "note is too long", 400);
  }
  await getPaymentDetail({ kind: normalizedKind, recordId: id });
  await pool.query(
    "INSERT INTO payment_admin_notes (payment_kind, record_id, admin_id, note) VALUES (?, ?, ?, ?)",
    [normalizedKind, id, Number(adminId), text]
  );
  return getPaymentDetail({ kind: normalizedKind, recordId: id });
};

const updateCatalogServiceOrder = async ({ serviceId, direction }) => {
  const normalizedDirection = String(direction || "").trim().toLowerCase();
  const deltaByDirection = {
    up: -10,
    down: 10
  };
  const delta = deltaByDirection[normalizedDirection];
  if (!delta) {
    throw new AppError("CATALOG_ACTION_INVALID", "Catalog action not supported", 400);
  }

  await pool.query(
    `UPDATE service_catalog
     SET display_order = GREATEST(0, display_order + ?)
     WHERE id = ?`,
    [delta, serviceId]
  );

  const [rows] = await pool.query(
    `SELECT sc.id,
            sc.code,
            sc.name,
            COALESCE(sc.group_name, sc.category) AS group_name,
            COALESCE(sc.subcategory, 'general') AS subcategory,
            sc.description,
            sc.display_order,
            sc.base_labour_minutes,
            sp.labour_rate_eur AS price
     FROM service_catalog sc
     LEFT JOIN service_pricing sp
       ON sp.service_id = sc.id AND sp.region = 'UK-default'
     WHERE sc.id = ?`,
    [serviceId]
  );

  if (!rows.length) return null;

  const row = rows[0];
  return {
    service_id: row.id,
    group: row.group_name || "-",
    subcategory: row.subcategory || "-",
    name: row.name || "-",
    code: row.code || "-",
    description: row.description || "",
    base_labour_minutes: row.base_labour_minutes,
    price: row.price,
    display_order: row.display_order
  };
};

const updateCatalogService = async ({
  serviceId,
  name,
  description,
  base_labour_minutes,
  price,
  region = "UK-default"
}) => {
  const id = Number(serviceId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("VALIDATION_ERROR", "serviceId is invalid", 400);
  }

  const hasName = name !== undefined;
  const hasDescription = description !== undefined;
  const hasLabour = base_labour_minutes !== undefined;
  const hasPrice = price !== undefined;
  if (!hasName && !hasDescription && !hasLabour && !hasPrice) {
    throw new AppError("VALIDATION_ERROR", "No catalog fields to update", 400);
  }

  const [existingRows] = await pool.query("SELECT id FROM service_catalog WHERE id = ? LIMIT 1", [id]);
  if (!existingRows.length) {
    throw new AppError("NOT_FOUND", "Catalog service not found", 404);
  }

  const updates = [];
  const values = [];
  if (hasName) {
    const trimmedName = String(name || "").trim();
    if (!trimmedName) {
      throw new AppError("VALIDATION_ERROR", "name is required", 400);
    }
    updates.push("name = ?");
    values.push(trimmedName);
  }
  if (hasDescription) {
    const trimmedDescription = String(description || "").trim();
    updates.push("description = ?");
    values.push(trimmedDescription || null);
  }
  if (hasLabour) {
    const labourMinutes = Number(base_labour_minutes);
    if (!Number.isFinite(labourMinutes) || labourMinutes <= 0) {
      throw new AppError("VALIDATION_ERROR", "base_labour_minutes must be greater than 0", 400);
    }
    updates.push("base_labour_minutes = ?");
    values.push(Math.round(labourMinutes));
  }
  if (updates.length) {
    values.push(id);
    await pool.query(`UPDATE service_catalog SET ${updates.join(", ")} WHERE id = ?`, values);
  }

  if (hasPrice) {
    const labourRate = Number(price);
    if (!Number.isFinite(labourRate) || labourRate < 0) {
      throw new AppError("VALIDATION_ERROR", "price must be zero or greater", 400);
    }
    await pool.query(
      `INSERT INTO service_pricing (service_id, region, labour_rate_eur)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE labour_rate_eur = VALUES(labour_rate_eur)`,
      [id, String(region || "UK-default").trim() || "UK-default", Number(labourRate.toFixed(2))]
    );
  }

  const [rows] = await pool.query(
    `SELECT sc.id,
            sc.code,
            sc.name,
            COALESCE(sc.group_name, sc.category) AS group_name,
            COALESCE(sc.subcategory, 'general') AS subcategory,
            sc.description,
            sc.display_order,
            sc.base_labour_minutes,
            sp.labour_rate_eur AS price
     FROM service_catalog sc
     LEFT JOIN service_pricing sp
       ON sp.service_id = sc.id AND sp.region = ?
     WHERE sc.id = ?
     LIMIT 1`,
    [String(region || "UK-default").trim() || "UK-default", id]
  );

  if (!rows.length) {
    throw new AppError("NOT_FOUND", "Catalog service not found", 404);
  }
  const row = rows[0];
  return {
    service_id: row.id,
    group: row.group_name || "-",
    subcategory: row.subcategory || "-",
    name: row.name || "-",
    code: row.code || "-",
    description: row.description || "",
    base_labour_minutes: row.base_labour_minutes,
    price: row.price,
    display_order: row.display_order
  };
};

const createCatalogService = async ({ groupKey, name, region = "UK-default" }) => {
  const normalizedGroup = String(groupKey || "").trim().toLowerCase();
  const trimmedName = String(name || "").trim();
  if (!normalizedGroup) {
    throw new AppError("VALIDATION_ERROR", "groupKey is required", 400);
  }
  if (!trimmedName) {
    throw new AppError("VALIDATION_ERROR", "name is required", 400);
  }

  const slugBase = trimmedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 52) || "service";
  let code = slugBase;
  let suffix = 1;
  while (true) {
    const [existsRows] = await pool.query("SELECT id FROM service_catalog WHERE code = ? LIMIT 1", [code]);
    if (!existsRows.length) break;
    suffix += 1;
    code = `${slugBase}_${suffix}`;
  }

  const [[orderRow]] = await pool.query(
    `SELECT COALESCE(MAX(display_order), 0) AS max_display_order
     FROM service_catalog
     WHERE COALESCE(group_name, category) = ?`,
    [normalizedGroup]
  );
  const nextDisplayOrder = Number(orderRow?.max_display_order || 0) + 10;

  const [insertResult] = await pool.query(
    `INSERT INTO service_catalog
      (code, name, category, group_name, subcategory, display_order, description, base_labour_minutes)
     VALUES (?, ?, ?, NULL, 'general', ?, NULL, 60)`,
    [code, trimmedName, normalizedGroup, nextDisplayOrder]
  );

  await pool.query(
    `INSERT INTO service_pricing (service_id, region, labour_rate_eur)
     VALUES (?, ?, 0.00)
     ON DUPLICATE KEY UPDATE labour_rate_eur = VALUES(labour_rate_eur)`,
    [insertResult.insertId, String(region || "UK-default").trim() || "UK-default"]
  );

  return updateCatalogService({ serviceId: insertResult.insertId, name: trimmedName, region });
};

const deleteCatalogService = async ({ serviceId }) => {
  const id = Number(serviceId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("VALIDATION_ERROR", "serviceId is invalid", 400);
  }
  const [existingRows] = await pool.query("SELECT id FROM service_catalog WHERE id = ? LIMIT 1", [id]);
  if (!existingRows.length) {
    throw new AppError("NOT_FOUND", "Catalog service not found", 404);
  }
  await pool.query("DELETE FROM service_catalog WHERE id = ?", [id]);
  return { deleted: true, service_id: id };
};

const setUserRole = async ({ userId, role, action }) => {
  const normalizedRole = String(role || "").trim().toLowerCase();
  if (!["user", "mechanic", "admin"].includes(normalizedRole)) {
    throw new AppError("ROLE_INVALID", "Role not supported", 400);
  }
  if (action === "remove") {
    await pool.query("DELETE FROM user_roles WHERE user_id = ? AND role = ?", [userId, normalizedRole]);
    return { user_id: userId, role: normalizedRole, action: "removed" };
  }
  await pool.query(
    "INSERT INTO user_roles (user_id, role) VALUES (?, ?) ON DUPLICATE KEY UPDATE role = role",
    [userId, normalizedRole]
  );
  return { user_id: userId, role: normalizedRole, action: "added" };
};

const setUserStatus = async ({ userId, status }) => {
  const normalizedStatus = String(status || "").trim().toLowerCase();
  const allowed = ["pending", "active", "suspended", "banned"];
  if (!allowed.includes(normalizedStatus)) {
    throw new AppError("STATUS_INVALID", "Status not supported", 400);
  }
  await pool.query("UPDATE users SET status = ? WHERE id = ?", [normalizedStatus, userId]);
  return { user_id: userId, status: normalizedStatus };
};

const updateUser = async ({
  userId,
  full_name,
  middle_name,
  phone,
  username,
  address,
  role,
  status
}) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await ensureUserProfileMiddleNameColumn();

    const [[existing]] = await connection.query(
      `SELECT u.id, u.username, u.phone, u.status, u.role,
              p.name, p.middle_name, p.lastname,
              GROUP_CONCAT(DISTINCT ur.role) AS roles
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       WHERE u.id = ?
       GROUP BY u.id`,
      [userId]
    );

    if (!existing) {
      throw new AppError("USER_NOT_FOUND", "User not found", 404);
    }

    const trimmedName = String(full_name || "").trim();
    const [firstName = "", ...lastNameParts] = trimmedName.split(/\s+/).filter(Boolean);
    const lastName = lastNameParts.join(" ");
    const resolvedMiddleName = String(middle_name || "").trim();
    const nextPhone = String(phone || "").trim() || null;
    const nextUsername = String(username || "").trim() || null;
    const nextAddress = normalizeAddressPayload(address);
    const normalizedRole = String(role || "").trim().toLowerCase();
    const normalizedStatus = String(status || "").trim().toLowerCase();

    if (!trimmedName) {
      throw new AppError("VALIDATION_ERROR", "Full name is required", 400);
    }

    if (!["user", "mechanic", "admin"].includes(normalizedRole)) {
      throw new AppError("ROLE_INVALID", "Role not supported", 400);
    }

    if (!["pending", "active", "suspended", "banned"].includes(normalizedStatus)) {
      throw new AppError("STATUS_INVALID", "Status not supported", 400);
    }

    if (nextUsername) {
      const [[usernameRow]] = await connection.query("SELECT id FROM users WHERE username = ? AND id <> ?", [nextUsername, userId]);
      if (usernameRow) {
        throw new AppError("USERNAME_TAKEN", "Username is already in use", 409);
      }
    }

    await connection.query("UPDATE users SET username = ?, phone = ?, status = ? WHERE id = ?", [
      nextUsername,
      nextPhone,
      normalizedStatus,
      userId
    ]);

    await connection.query(
      `INSERT INTO user_profiles (user_id, name, middle_name, lastname)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), middle_name = VALUES(middle_name), lastname = VALUES(lastname)`,
      [userId, firstName || trimmedName, resolvedMiddleName || null, lastName || null]
    );

    if (normalizedRole === "mechanic") {
      const displayName = [firstName || trimmedName, resolvedMiddleName || null, lastName || null].filter(Boolean).join(" ").trim();
      await connection.query(
        `INSERT INTO mechanic_profiles (user_id, display_name, legal_name)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), legal_name = VALUES(legal_name)`,
        [userId, displayName, displayName]
      );
    }

    await connection.query("DELETE FROM user_roles WHERE user_id = ?", [userId]);
    await connection.query("INSERT INTO user_roles (user_id, role) VALUES (?, ?)", [userId, normalizedRole]);
    await connection.query("UPDATE users SET role = ? WHERE id = ?", [normalizedRole, userId]);

    if (nextAddress) {
      const line1 = nextAddress.line1 || "";
      const line2 = nextAddress.line2 || "";
      const city = nextAddress.city || "-";
      const postalCode = nextAddress.postal_code || "-";

      const [addressRows] = await connection.query(
        `SELECT id
         FROM addresses
         WHERE user_id = ?
         ORDER BY id DESC
         LIMIT 1`,
        [userId]
      );

      if (addressRows.length) {
        await connection.query(
          "UPDATE addresses SET line1 = ?, line2 = ?, city = ?, postal_code = ?, country = ? WHERE id = ?",
          [line1, line2 || null, city || "-", postalCode || "-", nextAddress.country || "GB", addressRows[0].id]
        );
      } else {
        await connection.query(
          `INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
           VALUES (UUID_TO_BIN(UUID()), ?, 'Primary', ?, ?, ?, ?, ?, ST_GeomFromText('POINT(0 0)', 4326))`,
          [userId, line1, line2 || null, city || "-", postalCode || "-", nextAddress.country || "GB"]
        );
      }
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  const users = await listUsers();
  return users.find((item) => Number(item.user_id) === Number(userId)) || null;
};

const deleteUser = async ({ userId }) => {
  const [[user]] = await pool.query(
    `SELECT u.id, u.email, u.role,
            GROUP_CONCAT(DISTINCT ur.role) AS roles
     FROM users u
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     WHERE u.id = ?
     GROUP BY u.id`,
    [userId]
  );

  if (!user) {
    throw new AppError("USER_NOT_FOUND", "User not found", 404);
  }

  const roles = (user.roles ? String(user.roles).split(",") : [user.role]).map(roleLabel);
  if (roles.includes("ADMIN")) {
    throw new AppError("USER_DELETE_FORBIDDEN", "Admin users cannot be deleted", 403);
  }

  if (!roles.some((role) => role === "MECHANIC" || role === "CUSTOMER")) {
    throw new AppError("USER_DELETE_FORBIDDEN", "Only mechanic or customer users can be deleted", 403);
  }

  try {
    await pool.query("DELETE FROM users WHERE id = ?", [userId]);
  } catch (error) {
    if (error && (error.code === "ER_ROW_IS_REFERENCED_2" || error.code === "ER_ROW_IS_REFERENCED")) {
      throw new AppError(
        "USER_DELETE_BLOCKED",
        "This user cannot be deleted because it is linked to existing bookings or protected records",
        409
      );
    }
    throw error;
  }

  return { deleted: true, user_id: userId, email: user.email };
};

module.exports = {
  listWorkshops,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  listUsers,
  listApplications,
  listApplicationDocuments,
  updateApplicationStatus,
  listBookings,
  updateBookingStatus,
  listResolutionCases,
  getResolutionCaseDetail,
  updateResolutionCaseStatus,
  addResolutionCaseMessage,
  getDashboardSummary,
  listContactMessages,
  updateContactMessageStatus,
  listPayments,
  getPaymentDetail,
  addPaymentAdminNote,
  updatePaymentStatus,
  createCatalogService,
  updateCatalogService,
  updateCatalogServiceOrder,
  deleteCatalogService,
  setUserRole,
  setUserStatus,
  updateUser,
  deleteUser
};



