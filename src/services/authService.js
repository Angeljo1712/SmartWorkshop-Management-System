const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/pool");
const { env } = require("../config/env");
const { AppError } = require("../utils/appError");
const crypto = require("crypto");

const createToken = (user) =>
  jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

const splitFullName = (value) => {
  const parts = String(value || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { name: "", lastname: "" };
  const name = parts.shift();
  const lastname = parts.join(" ");
  return { name, lastname: lastname || "-" };
};

const register = async ({ full_name, name, lastname, email, password, role }) => {
  const resolvedName = name || splitFullName(full_name).name;
  const resolvedLastname = lastname || splitFullName(full_name).lastname;
  if (!resolvedName || !resolvedLastname || !email || !password || !role) {
    throw new AppError("VALIDATION_ERROR", "name, lastname, email, password, role are required", 400);
  }

  const normalizedRole = String(role).toUpperCase();
  const allowedRoles = ["USER", "MECHANIC", "ADMIN"];
  if (!allowedRoles.includes(normalizedRole)) {
    throw new AppError("ROLE_INVALID", "Role not supported", 400);
  }

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing[0]) {
    throw new AppError("EMAIL_IN_USE", "Email already registered", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (uuid_public, email, password_hash, role) VALUES (UUID_TO_BIN(UUID()), ?, ?, ?)",
    [email, passwordHash, normalizedRole.toLowerCase()]
  );
  await pool.query(
    "INSERT INTO user_profiles (user_id, name, lastname) VALUES (?, ?, ?)",
    [result.insertId, resolvedName, resolvedLastname]
  );

  const user = {
    id: result.insertId,
    name: resolvedName,
    lastname: resolvedLastname,
    email,
    role: normalizedRole.toLowerCase()
  };

  const token = createToken(user);
  return { user, token };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("VALIDATION_ERROR", "email and password are required", 400);
  }

  const [rows] = await pool.query(
    `SELECT u.id, BIN_TO_UUID(u.uuid_public) AS uuid_public, u.email, u.phone, u.password_hash, u.role, u.last_login_at,
            p.name, p.lastname, p.avatar_url
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
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

  await pool.query("UPDATE users SET last_login_at = NOW() WHERE id = ?", [user.id]);
  const token = createToken(user);
  return {
    user: {
      id: user.id,
      uuid_public: user.uuid_public,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      avatar_url: user.avatar_url,
      role: user.role,
      last_login_at: user.last_login_at
    },
    token
  };
};

const requestPasswordReset = async (email) => {
  if (!email) {
    throw new AppError("VALIDATION_ERROR", "email is required", 400);
  }

  const [rows] = await pool.query("SELECT id, email FROM users WHERE email = ?", [email]);
  const user = rows[0];
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  await pool.query(
    "INSERT INTO password_reset_requests (user_id, token, expires_at) VALUES (?, ?, ?)",
    [user.id, token, expiresAt]
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
  await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, request.user_id]);
  await pool.query("DELETE FROM password_reset_requests WHERE request_id = ?", [request.request_id]);
};

module.exports = { register, login, requestPasswordReset, resetPassword };



