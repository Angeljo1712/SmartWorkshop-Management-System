const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/pool");
const { env } = require("../config/env");
const { AppError } = require("../../frontend/src/utils/appError");
const crypto = require("crypto");

const createToken = (user) =>
  jwt.sign({ userId: user.user_id, role: user.role_name }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

const register = async ({ full_name, email, password, role }) => {
  if (!full_name || !email || !password || !role) {
    throw new AppError("VALIDATION_ERROR", "full_name, email, password, role are required", 400);
  }

  const normalizedRole = String(role).toUpperCase();
  const [roleRows] = await pool.query("SELECT role_id, role_name FROM roles WHERE role_name = ?", [normalizedRole]);
  if (!roleRows[0]) {
    throw new AppError("ROLE_INVALID", "Role not supported", 400);
  }

  const [existing] = await pool.query("SELECT user_id FROM users WHERE email = ?", [email]);
  if (existing[0]) {
    throw new AppError("EMAIL_IN_USE", "Email already registered", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (full_name, email, username, password_hash, role_id) VALUES (?, ?, ?, ?, ?)",
    [full_name, email, String(email).split("@")[0], passwordHash, roleRows[0].role_id]
  );

  const user = {
    user_id: result.insertId,
    full_name,
    email,
    role_name: roleRows[0].role_name
  };

  const token = createToken(user);
  return { user, token };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("VALIDATION_ERROR", "email and password are required", 400);
  }

  const [rows] = await pool.query(
    `SELECT u.user_id, u.full_name, u.email, u.username, u.password_hash, u.status, u.last_active, u.phone, u.address, u.avatar_url, r.role_name
     FROM users u
     JOIN roles r ON u.role_id = r.role_id
     WHERE u.email = ?`,
    [email]
  );

  const user = rows[0];
  if (!user) {
    throw new AppError("AUTH_FAILED", "Invalid credentials", 401);
  }

  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) {
    throw new AppError("AUTH_FAILED", "Invalid credentials", 401);
  }

  await pool.query("UPDATE users SET last_active = NOW() WHERE user_id = ?", [user.user_id]);
  const token = createToken(user);
  return {
    user: {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      username: user.username,
      phone: user.phone,
      address: user.address,
      avatar_url: user.avatar_url,
      role_name: user.role_name,
      status: user.status,
      last_active: user.last_active
    },
    token
  };
};

const requestPasswordReset = async (email) => {
  if (!email) {
    throw new AppError("VALIDATION_ERROR", "email is required", 400);
  }

  const [rows] = await pool.query("SELECT user_id, email FROM users WHERE email = ?", [email]);
  const user = rows[0];
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  await pool.query(
    "INSERT INTO password_reset_requests (user_id, token, expires_at) VALUES (?, ?, ?)",
    [user.user_id, token, expiresAt]
  );

  return { token, email: user.email, expiresAt };
};

const resetPassword = async ({ token, password }) => {
  if (!token || !password) {
    throw new AppError("VALIDATION_ERROR", "token and password are required", 400);
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

  const [rows] = await pool.query(
    `SELECT request_id, user_id, expires_at
     FROM password_reset_requests
     WHERE token = ?`,
    [token]
  );
  const request = rows[0];
  if (!request) {
    throw new AppError("INVALID_TOKEN", "Invalid or expired token", 400);
  }
  if (new Date(request.expires_at).getTime() < Date.now()) {
    await pool.query("DELETE FROM password_reset_requests WHERE request_id = ?", [request.request_id]);
    throw new AppError("INVALID_TOKEN", "Token expired", 400);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query("UPDATE users SET password_hash = ? WHERE user_id = ?", [passwordHash, request.user_id]);
  await pool.query("DELETE FROM password_reset_requests WHERE request_id = ?", [request.request_id]);
};

module.exports = { register, login, requestPasswordReset, resetPassword };



