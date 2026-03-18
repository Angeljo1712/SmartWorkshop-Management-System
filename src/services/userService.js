const { pool } = require("../config/pool");
const { AppError } = require("../utils/appError");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const toRoleLabel = (role) => {
  const normalized = String(role || "").toLowerCase();
  if (normalized === "user") return "CUSTOMER";
  if (normalized === "mechanic") return "MECHANIC";
  if (normalized === "admin") return "ADMIN";
  return String(role || "").toUpperCase();
};

const formatAddressRow = (row) =>
  [row?.line1, row?.line2, row?.city, row?.postal_code, row?.country]
    .filter((value) => String(value || "").trim())
    .join(", ");

const getLatestAddress = async (userId) => {
  const [rows] = await pool.query(
    `SELECT line1, line2, city, postal_code, country
     FROM addresses
     WHERE user_id = ?
     ORDER BY id DESC
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
};

const getUserById = async (userId) => {
  const [rows] = await pool.query(
    `SELECT u.id, BIN_TO_UUID(u.uuid_public) AS uuid_public, u.email, u.username, u.phone, u.role, u.status, u.created_at, u.last_login_at,
            p.name, p.lastname, p.avatar_url,
            GROUP_CONCAT(ur.role) AS roles
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     WHERE u.id = ?
     GROUP BY u.id`,
    [userId]
  );
  const user = rows[0];
  if (!user) return null;
  const addressRow = await getLatestAddress(userId);
  const address = formatAddressRow(addressRow) || "";
  const roles = (user.roles ? String(user.roles).split(",") : [user.role]).map(toRoleLabel);
  const primaryRole = roles.includes("ADMIN")
    ? "ADMIN"
    : roles.includes("MECHANIC")
      ? "MECHANIC"
      : "CUSTOMER";
  return {
    ...user,
    address,
    address_details: addressRow
      ? {
          line1: addressRow.line1 || "",
          line2: addressRow.line2 || "",
          city: addressRow.city || "",
          postal_code: addressRow.postal_code || "",
          country: addressRow.country || "GB"
        }
      : null,
    role_name: primaryRole,
    roles
  };
};

const resolveNames = (payload) => {
  if (payload.name && payload.lastname) {
    return { name: payload.name.trim(), lastname: payload.lastname.trim() };
  }
  if (payload.full_name) {
    const parts = String(payload.full_name).trim().split(/\s+/);
    const name = parts.shift() || "";
    const lastname = parts.join(" ") || "-";
    return { name, lastname };
  }
  return { name: null, lastname: null };
};

const updateUserProfile = async (userId, { name, lastname, full_name, phone, username, address }) => {
  const updates = [];
  const params = [];

  if (phone !== undefined) {
    updates.push("phone = ?");
    params.push(phone);
  }

  if (username !== undefined) {
    const normalized = String(username || "").trim().toLowerCase();
    if (!normalized) {
      throw new AppError("VALIDATION_ERROR", "username is required", 400);
    }
    if (!/^[a-z0-9._-]{3,64}$/.test(normalized)) {
      throw new AppError(
        "VALIDATION_ERROR",
        "username must be 3-64 chars and contain only letters, numbers, dot, underscore or hyphen",
        400
      );
    }
    const [existing] = await pool.query("SELECT id FROM users WHERE username = ? AND id <> ?", [
      normalized,
      userId
    ]);
    if (existing[0]) {
      throw new AppError("USERNAME_IN_USE", "Username already in use", 409);
    }
    updates.push("username = ?");
    params.push(normalized);
  }

  if (updates.length) {
    params.push(userId);
    await pool.query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params);
  }

  if (address !== undefined) {
    if (address && typeof address === "object") {
      const line1 = String(address.line1 || "").trim();
      const line2 = String(address.line2 || "").trim();
      const city = String(address.city || "").trim();
      const postalCode = String(address.postal_code || "").trim();
      const country = String(address.country || "GB").trim() || "GB";
      if (line1 && city && postalCode) {
        await pool.query(
          `INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
           VALUES (UUID_TO_BIN(UUID()), ?, 'Profile', ?, ?, ?, ?, ?, ST_GeomFromText('POINT(0 0)', 4326))`,
          [userId, line1, line2 || null, city, postalCode, country]
        );
      }
    } else {
      const normalizedAddress = String(address || "").trim();
      if (normalizedAddress) {
        await pool.query(
          `INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
           VALUES (UUID_TO_BIN(UUID()), ?, 'Profile', ?, NULL, '-', '-', 'GB', ST_GeomFromText('POINT(0 0)', 4326))`,
          [userId, normalizedAddress]
        );
      }
    }
  }

  const resolved = resolveNames({ name, lastname, full_name });
  if (resolved.name && resolved.lastname) {
    await pool.query(
      `INSERT INTO user_profiles (user_id, name, lastname)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), lastname = VALUES(lastname)`,
      [userId, resolved.name, resolved.lastname]
    );
  } else if (!updates.length && address === undefined) {
    throw new AppError("VALIDATION_ERROR", "No profile fields provided", 400);
  }

  return getUserById(userId);
};

const updateUserAvatar = async (userId, avatarUrl) => {
  await pool.query(
    `INSERT INTO user_profiles (user_id, name, lastname, avatar_url)
     VALUES (?, '-', '-', ?)
     ON DUPLICATE KEY UPDATE avatar_url = VALUES(avatar_url)`,
    [userId, avatarUrl]
  );
  return getUserById(userId);
};

const changeUserPassword = async (userId, { old_password, new_password }) => {
  const currentPassword = String(old_password || "");
  const nextPassword = String(new_password || "");

  if (!currentPassword || !nextPassword) {
    throw new AppError("VALIDATION_ERROR", "old_password and new_password are required", 400);
  }
  if (nextPassword.length < 10) {
    throw new AppError("VALIDATION_ERROR", "New password must be at least 10 characters long.", 400);
  }
  if (!/[A-Z]/.test(nextPassword)) {
    throw new AppError("VALIDATION_ERROR", "New password must include at least one uppercase letter.", 400);
  }
  if (!/[0-9]/.test(nextPassword)) {
    throw new AppError("VALIDATION_ERROR", "New password must include at least one number.", 400);
  }
  if (!/[^A-Za-z0-9]/.test(nextPassword)) {
    throw new AppError("VALIDATION_ERROR", "New password must include at least one special character.", 400);
  }

  const [rows] = await pool.query("SELECT password_hash FROM users WHERE id = ? LIMIT 1", [userId]);
  const user = rows[0];
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }

  const matches = await bcrypt.compare(currentPassword, user.password_hash);
  if (!matches) {
    throw new AppError("AUTH_FAILED", "Old password is incorrect.", 401);
  }
  if (currentPassword === nextPassword) {
    throw new AppError("VALIDATION_ERROR", "New password must be different from the old password.", 400);
  }

  const passwordHash = await bcrypt.hash(nextPassword, 10);
  await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, userId]);
  return { message: "Password updated." };
};

const mapVehicleRow = (row) => ({
  id: row.id,
  uuid_public: row.uuid_public,
  registrationNumber: row.license_plate,
  make: row.make || "",
  model: row.model || "",
  yearOfManufacture: row.year || null,
  fuelType: row.fuel_type || "",
  mileage: row.mileage || "-",
  motStatus: row.mot_status || "MOT status not available",
  taxStatus: row.tax_status || "Tax status not available"
});

const listUserVehicles = async (userId) => {
  const [rows] = await pool.query(
    `SELECT id,
            BIN_TO_UUID(uuid_public) AS uuid_public,
            license_plate,
            make,
            model,
            year,
            NULL AS fuel_type,
            NULL AS mileage,
            NULL AS mot_status,
            NULL AS tax_status
     FROM vehicles
     WHERE user_id = ?
     ORDER BY id ASC`,
    [userId]
  );

  return rows.map(mapVehicleRow);
};

const saveUserVehicle = async (userId, payload) => {
  const registrationNumber = String(payload.registrationNumber || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!registrationNumber) {
    throw new AppError("VALIDATION_ERROR", "registrationNumber is required", 400);
  }

  const make = String(payload.make || "").trim();
  const model = String(payload.model || "").trim();
  const year = payload.yearOfManufacture ? Number(payload.yearOfManufacture) : null;

  await pool.query(
    `INSERT INTO vehicles (uuid_public, user_id, license_plate, make, model, year)
     VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       make = VALUES(make),
       model = VALUES(model),
       year = VALUES(year)`,
    [userId, registrationNumber, make, model, Number.isFinite(year) ? year : null]
  );

  const [rows] = await pool.query(
    `SELECT id,
            BIN_TO_UUID(uuid_public) AS uuid_public,
            license_plate,
            make,
            model,
            year,
            NULL AS fuel_type,
            NULL AS mileage,
            NULL AS mot_status,
            NULL AS tax_status
     FROM vehicles
     WHERE user_id = ? AND license_plate = ?
     LIMIT 1`,
    [userId, registrationNumber]
  );

  return rows[0] ? mapVehicleRow(rows[0]) : null;
};

const deleteUserVehicle = async (userId, registrationNumber) => {
  const normalized = String(registrationNumber || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!normalized) {
    throw new AppError("VALIDATION_ERROR", "registrationNumber is required", 400);
  }

  await pool.query("DELETE FROM vehicles WHERE user_id = ? AND license_plate = ?", [userId, normalized]);
  return { deleted: true };
};

const listUserBookings = async (userId) => {
  const [rows] = await pool.query(
    `SELECT b.id,
            BIN_TO_UUID(b.uuid_public) AS uuid_public,
            b.status,
            b.notes,
            b.subtotal_eur,
            b.vat_eur,
            b.total_eur,
            b.created_at,
            a.line1,
            a.line2,
            a.city,
            a.postal_code,
            a.country,
            v.license_plate,
            v.make,
            v.model,
            v.year,
            s.start_at AS slot_start_at,
            s.end_at AS slot_end_at,
            up.name AS mechanic_name,
            up.lastname AS mechanic_lastname
     FROM bookings b
     LEFT JOIN addresses a ON a.id = b.address_id
     LEFT JOIN vehicles v ON v.id = b.vehicle_id
     LEFT JOIN availability_slots s ON s.id = b.slot_id
     LEFT JOIN user_profiles up ON up.user_id = b.mechanic_id
     WHERE b.customer_id = ?
     ORDER BY b.created_at DESC`,
    [userId]
  );

  if (!rows.length) return [];

  const bookingIds = rows.map((row) => row.id);

  const [itemRows] = await pool.query(
    `SELECT bi.booking_id,
            sc.name,
            bi.labour_minutes,
            bi.parts_json,
            bi.line_total_eur
     FROM booking_items bi
     INNER JOIN service_catalog sc ON sc.id = bi.service_id
     WHERE bi.booking_id IN (?)`,
    [bookingIds]
  );

  const [paymentRows] = await pool.query(
    `SELECT p.booking_id, p.status, p.amount_eur, p.currency, p.provider_ref
     FROM payments p
     INNER JOIN (
       SELECT booking_id, MAX(id) AS latest_id
       FROM payments
       WHERE booking_id IN (?)
       GROUP BY booking_id
     ) latest ON latest.latest_id = p.id`,
    [bookingIds]
  );

  const itemsByBooking = new Map();
  itemRows.forEach((row) => {
    const list = itemsByBooking.get(row.booking_id) || [];
    let parts = [];
    if (row.parts_json) {
      try {
        parts = typeof row.parts_json === "string" ? JSON.parse(row.parts_json) : row.parts_json;
      } catch (_err) {
        parts = [];
      }
    }
    list.push({
      name: row.name,
      labour_minutes: row.labour_minutes,
      parts,
      line_total_eur: row.line_total_eur
    });
    itemsByBooking.set(row.booking_id, list);
  });

  const paymentsByBooking = new Map(paymentRows.map((row) => [row.booking_id, row]));

  return rows.map((row) => {
    const items = itemsByBooking.get(row.id) || [];
    const payment = paymentsByBooking.get(row.id) || null;
    return {
      id: row.id,
      uuid_public: row.uuid_public,
      reference: row.uuid_public || String(row.id),
      status: row.status,
      notes: row.notes || "",
      totals: {
        subtotal_eur: Number(row.subtotal_eur || 0),
        vat_eur: Number(row.vat_eur || 0),
        total_eur: Number(row.total_eur || 0)
      },
      created_at: row.created_at,
      slot: row.slot_start_at
        ? {
            start_at: row.slot_start_at,
            end_at: row.slot_end_at
          }
        : null,
      address: {
        line1: row.line1 || "",
        line2: row.line2 || "",
        city: row.city || "",
        postal_code: row.postal_code || "",
        country: row.country || ""
      },
      vehicle: {
        registrationNumber: row.license_plate || "",
        make: row.make || "",
        model: row.model || "",
        yearOfManufacture: row.year || null
      },
      mechanic: [row.mechanic_name, row.mechanic_lastname].filter(Boolean).join(" ") || null,
      payment: payment
        ? {
            status: payment.status,
            amount_eur: Number(payment.amount_eur || 0),
            currency: payment.currency,
            provider_ref: payment.provider_ref
          }
        : null,
      items
    };
  });
};

const requestEmailChange = async (userId, newEmail) => {
  if (!newEmail) {
    throw new AppError("VALIDATION_ERROR", "email is required", 400);
  }
  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [newEmail]);
  if (existing[0]) {
    throw new AppError("EMAIL_IN_USE", "Email already registered", 409);
  }

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  await pool.query(
    "INSERT INTO email_change_requests (user_id, new_email, token, expires_at) VALUES (?, ?, ?, ?)",
    [userId, newEmail, token, expiresAt]
  );

  return { token, expiresAt };
};

const confirmEmailChange = async (token) => {
  if (!token) {
    throw new AppError("VALIDATION_ERROR", "token is required", 400);
  }

  const [rows] = await pool.query(
    `SELECT id, user_id, new_email, expires_at
     FROM email_change_requests
     WHERE token = ?`,
    [token]
  );
  const request = rows[0];
  if (!request) {
    throw new AppError("INVALID_TOKEN", "Invalid or expired token", 400);
  }
  if (new Date(request.expires_at).getTime() < Date.now()) {
    await pool.query("DELETE FROM email_change_requests WHERE id = ?", [request.id]);
    throw new AppError("INVALID_TOKEN", "Token expired", 400);
  }

  await pool.query("UPDATE users SET email = ? WHERE id = ?", [request.new_email, request.user_id]);
  await pool.query("DELETE FROM email_change_requests WHERE id = ?", [request.id]);
  return getUserById(request.user_id);
};

module.exports = {
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  changeUserPassword,
  requestEmailChange,
  confirmEmailChange,
  listUserVehicles,
  saveUserVehicle,
  deleteUserVehicle,
  listUserBookings
};
