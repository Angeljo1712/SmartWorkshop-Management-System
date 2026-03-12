const { pool } = require("../config/pool");
const { AppError } = require("../utils/appError");
const crypto = require("crypto");

const toRoleLabel = (role) => {
  const normalized = String(role || "").toLowerCase();
  if (normalized === "user") return "CUSTOMER";
  if (normalized === "mechanic") return "MECHANIC";
  if (normalized === "admin") return "ADMIN";
  return String(role || "").toUpperCase();
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
  const roles = (user.roles ? String(user.roles).split(",") : [user.role]).map(toRoleLabel);
  const primaryRole = roles.includes("ADMIN")
    ? "ADMIN"
    : roles.includes("MECHANIC")
      ? "MECHANIC"
      : "CUSTOMER";
  return {
    ...user,
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

const updateUserProfile = async (userId, { name, lastname, full_name, phone, username }) => {
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

  const resolved = resolveNames({ name, lastname, full_name });
  if (resolved.name && resolved.lastname) {
    await pool.query(
      `INSERT INTO user_profiles (user_id, name, lastname)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), lastname = VALUES(lastname)`,
      [userId, resolved.name, resolved.lastname]
    );
  } else if (!updates.length) {
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
  requestEmailChange,
  confirmEmailChange,
  listUserVehicles,
  saveUserVehicle,
  deleteUserVehicle
};
