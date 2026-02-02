const { pool } = require("../config/pool");
const { AppError } = require("../../frontend/src/utils/appError");
const crypto = require("crypto");

const getUserById = async (userId) => {
  const [rows] = await pool.query(
    `SELECT u.user_id, u.full_name, u.email, u.username, u.phone, u.address, u.avatar_url, r.role_name
     FROM users u
     JOIN roles r ON u.role_id = r.role_id
     WHERE u.user_id = ?`,
    [userId]
  );
  return rows[0];
};

const updateUserProfile = async (userId, { full_name, phone, address }) => {
  const updates = [];
  const params = [];

  if (full_name !== undefined) {
    updates.push("full_name = ?");
    params.push(full_name);
  }
  if (phone !== undefined) {
    updates.push("phone = ?");
    params.push(phone);
  }
  if (address !== undefined) {
    updates.push("address = ?");
    params.push(address);
  }

  if (!updates.length) {
    throw new AppError("VALIDATION_ERROR", "No profile fields provided", 400);
  }

  params.push(userId);
  await pool.query(`UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`, params);
  return getUserById(userId);
};

const updateUserAvatar = async (userId, avatarUrl) => {
  await pool.query("UPDATE users SET avatar_url = ? WHERE user_id = ?", [avatarUrl, userId]);
  return getUserById(userId);
};

const requestEmailChange = async (userId, newEmail) => {
  if (!newEmail) {
    throw new AppError("VALIDATION_ERROR", "email is required", 400);
  }
  const [existing] = await pool.query("SELECT user_id FROM users WHERE email = ?", [newEmail]);
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

  const username = String(request.new_email).split("@")[0];
  await pool.query("UPDATE users SET email = ?, username = ? WHERE user_id = ?", [
    request.new_email,
    username,
    request.user_id
  ]);
  await pool.query("DELETE FROM email_change_requests WHERE request_id = ?", [request.request_id]);
  return getUserById(request.user_id);
};

module.exports = { getUserById, updateUserProfile, updateUserAvatar, requestEmailChange, confirmEmailChange };
