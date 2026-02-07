const { pool } = require("../config/pool");
const { AppError } = require("../utils/appError");
const crypto = require("crypto");

const getUserById = async (userId) => {
  const [rows] = await pool.query(
    `SELECT u.id, BIN_TO_UUID(u.uuid_public) AS uuid_public, u.email, u.phone, u.role, u.created_at, u.last_login_at,
            p.name, p.lastname, p.avatar_url
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     WHERE u.id = ?`,
    [userId]
  );
  return rows[0];
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

const updateUserProfile = async (userId, { name, lastname, full_name, phone }) => {
  const updates = [];
  const params = [];

  if (phone !== undefined) {
    updates.push("phone = ?");
    params.push(phone);
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
    `SELECT request_id, user_id, new_email, expires_at
     FROM email_change_requests
     WHERE token = ?`,
    [token]
  );
  const request = rows[0];
  if (!request) {
    throw new AppError("INVALID_TOKEN", "Invalid or expired token", 400);
  }
  if (new Date(request.expires_at).getTime() < Date.now()) {
    await pool.query("DELETE FROM email_change_requests WHERE request_id = ?", [request.request_id]);
    throw new AppError("INVALID_TOKEN", "Token expired", 400);
  }

  await pool.query("UPDATE users SET email = ? WHERE id = ?", [request.new_email, request.user_id]);
  await pool.query("DELETE FROM email_change_requests WHERE request_id = ?", [request.request_id]);
  return getUserById(request.user_id);
};

module.exports = { getUserById, updateUserProfile, updateUserAvatar, requestEmailChange, confirmEmailChange };
