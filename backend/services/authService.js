const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/pool");
const { env } = require("../config/env");
const { AppError } = require("../../frontend/src/utils/appError");

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
    `SELECT u.user_id, u.full_name, u.email, u.username, u.password_hash, u.status, u.last_active, u.phone, u.avatar_url, r.role_name
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
      avatar_url: user.avatar_url,
      role_name: user.role_name,
      status: user.status,
      last_active: user.last_active
    },
    token
  };
};

module.exports = { register, login };



