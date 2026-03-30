const { pool } = require("../config/pool");
const { AppError } = require("../utils/appError");

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
       AND COLUMN_NAME IN ('application_type', 'lead_postcode', 'application_status', 'account_status', 'password_set_at')`
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
};

const roleLabel = (role) => {
  const normalized = String(role || "").toLowerCase();
  if (normalized === "user") return "CUSTOMER";
  if (normalized === "mechanic") return "MECHANIC";
  if (normalized === "admin") return "ADMIN";
  return String(role || "").toUpperCase();
};

const listUsers = async () => {
  const [rows] = await pool.query(
    `SELECT u.id, u.email, u.username, u.phone, u.created_at, u.role, u.status,
            p.name, p.lastname, p.avatar_url,
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
      lastname: row.lastname || "",
      full_name: [row.name, row.lastname].filter(Boolean).join(" ") || "-",
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
  const [rows] = await pool.query(
    `SELECT u.id,
            u.email,
            u.phone,
            u.status AS user_status,
            u.created_at,
            p.name,
            p.lastname,
            mp.application_type,
            mp.business_type,
            mp.lead_postcode,
            mp.application_status,
            mp.account_status,
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
    full_name: [row.name, row.lastname].filter(Boolean).join(" ") || row.email,
    email: row.email,
    phone: row.phone || "",
    created_at: row.created_at,
    lead_postcode: row.lead_postcode || "",
    application_type: row.application_type || "",
    business_type: row.business_type || "",
    application_status: row.application_status || "unknown",
    account_status: row.account_status || "unknown",
    user_status: row.user_status || "pending",
    documents_count: Number(row.documents_count || 0),
    password_set_at: row.password_set_at || null
  }));
};

const updateApplicationStatus = async ({ userId, action }) => {
  await ensureMechanicProfileWorkflowColumns();
  const normalizedAction = String(action || "").trim().toLowerCase();
  const statesByAction = {
    approve: {
      application_status: "approved",
      account_status: "password_pending",
      user_status: "pending"
    },
    request_info: {
      application_status: "info_requested",
      account_status: "lead_created",
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

  await pool.query(
    `UPDATE mechanic_profiles
     SET application_status = ?, account_status = ?
     WHERE user_id = ?`,
    [nextState.application_status, nextState.account_status, userId]
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
    customer_name: [row.customer_name, row.customer_lastname].filter(Boolean).join(" ") || row.customer_email || "-",
    mechanic_name: [row.mechanic_name, row.mechanic_lastname].filter(Boolean).join(" ") || row.mechanic_email || "Unassigned",
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
  const bookings = await listBookings();
  return bookings.find((item) => Number(item.booking_id) === Number(bookingId)) || null;
};

const listResolutionCases = async () => {
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
            customer_profile.lastname AS customer_lastname,
            mechanic.email AS mechanic_email,
            mechanic_profile.name AS mechanic_name,
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
    customer_name: [row.customer_name, row.customer_lastname].filter(Boolean).join(" ") || row.customer_email || "-",
    mechanic_name: [row.mechanic_name, row.mechanic_lastname].filter(Boolean).join(" ") || row.mechanic_email || "-"
  }));
};

const updateResolutionCaseStatus = async ({ caseId, action }) => {
  const normalizedAction = String(action || "").trim().toLowerCase();
  const statusByAction = {
    close: "closed",
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

const listPayments = async () => {
  const [customerPayments] = await pool.query(
    `SELECT p.id,
            p.booking_id,
            p.provider,
            p.status,
            p.amount_eur,
            p.currency,
            p.provider_ref,
            p.created_at,
            customer.email AS customer_email,
            customer_profile.name AS customer_name,
            customer_profile.lastname AS customer_lastname
     FROM payments p
     INNER JOIN bookings b ON b.id = p.booking_id
     INNER JOIN users customer ON customer.id = b.customer_id
     LEFT JOIN user_profiles customer_profile ON customer_profile.user_id = customer.id
     ORDER BY p.created_at DESC`
  );

  const [payoutRows] = await pool.query(
    `SELECT po.id,
            po.amount_eur,
            po.status,
            po.provider_ref,
            po.created_at,
            mechanic.email AS mechanic_email,
            mechanic_profile.name AS mechanic_name,
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
    party: [row.customer_name, row.customer_lastname].filter(Boolean).join(" ") || row.customer_email || "-",
    provider: row.provider || "-",
    status: row.status || "authorized",
    amount: Number(row.amount_eur || 0),
    currency: row.currency || "GBP",
    created_at: row.created_at
  }));

  const payoutItems = payoutRows.map((row) => ({
    record_id: row.id,
    kind: "mechanic_payout",
    reference: `PAYOUT-${row.id}`,
    booking_reference: "-",
    party: [row.mechanic_name, row.mechanic_lastname].filter(Boolean).join(" ") || row.mechanic_email || "-",
    provider: row.provider_ref || "-",
    status: row.status || "requested",
    amount: Number(row.amount_eur || 0),
    currency: "GBP",
    created_at: row.created_at
  }));

  return [...paymentItems, ...payoutItems].sort((a, b) => {
    const left = new Date(a.created_at).getTime();
    const right = new Date(b.created_at).getTime();
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
    base_labour_minutes: row.base_labour_minutes,
    price: row.price,
    display_order: row.display_order
  };
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
  phone,
  username,
  address,
  role,
  status
}) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [[existing]] = await connection.query(
      `SELECT u.id, u.username, u.phone, u.status, u.role,
              p.name, p.lastname,
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
    const nextPhone = String(phone || "").trim() || null;
    const nextUsername = String(username || "").trim() || null;
    const nextAddress = String(address || "").trim();
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
      `INSERT INTO user_profiles (user_id, name, lastname)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), lastname = VALUES(lastname)`,
      [userId, firstName || trimmedName, lastName || null]
    );

    await connection.query("DELETE FROM user_roles WHERE user_id = ?", [userId]);
    await connection.query("INSERT INTO user_roles (user_id, role) VALUES (?, ?)", [userId, normalizedRole]);
    await connection.query("UPDATE users SET role = ? WHERE id = ?", [normalizedRole, userId]);

    if (nextAddress) {
      const [addressRows] = await connection.query(
        `SELECT id
         FROM addresses
         WHERE user_id = ?
         ORDER BY id DESC
         LIMIT 1`,
        [userId]
      );

      if (addressRows.length) {
        await connection.query("UPDATE addresses SET line1 = ?, line2 = '', city = '', postal_code = '', country = '' WHERE id = ?", [
          nextAddress,
          addressRows[0].id
        ]);
      } else {
        await connection.query(
          `INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
           VALUES (UUID(), ?, 'Primary', ?, '', '', '', '', '')`,
          [userId, nextAddress]
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
  updateApplicationStatus,
  listBookings,
  updateBookingStatus,
  listResolutionCases,
  updateResolutionCaseStatus,
  getDashboardSummary,
  listPayments,
  updatePaymentStatus,
  updateCatalogServiceOrder,
  setUserRole,
  setUserStatus,
  updateUser,
  deleteUser
};



