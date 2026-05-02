const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { AppError } = require("../utils/appError");
const { pool } = require("../config/pool");

const normalizeRole = (value) => String(value || "").trim().toUpperCase();

const authenticate = (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new AppError("AUTH_REQUIRED", "Authentication token required", 401));
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new AppError("AUTH_INVALID", "Invalid or expired token", 401));
  }
};

const authorizeRoles = (...roles) => async (req, _res, next) => {
  if (!req.user) {
    return next(new AppError("FORBIDDEN", "Insufficient permissions", 403));
  }
  const tokenRoles = (Array.isArray(req.user.roles)
    ? req.user.roles
    : req.user.role
      ? [req.user.role]
      : [])
    .map(normalizeRole)
      .filter(Boolean);
  const allowedRoles = roles.map(normalizeRole).filter(Boolean);

  const hasAllowedTokenRole = allowedRoles.some((role) => tokenRoles.includes(role));
  if (hasAllowedTokenRole) {
    return next();
  }

  try {
    const [rows] = await pool.query("SELECT role FROM user_roles WHERE user_id = ?", [req.user.userId]);
    const dbRoles = rows.map((row) => normalizeRole(row.role)).filter(Boolean);
    const hasAllowedDbRole = allowedRoles.some((role) => dbRoles.includes(role));
    if (!hasAllowedDbRole) {
      return next(new AppError("FORBIDDEN", "Insufficient permissions", 403));
    }
    req.user.roles = Array.from(new Set([...tokenRoles, ...dbRoles]));
    if (!req.user.role && req.user.roles.length) {
      [req.user.role] = req.user.roles;
    }
  } catch (_error) {
    return next(new AppError("FORBIDDEN", "Insufficient permissions", 403));
  }
  return next();
};

module.exports = { authenticate, authorizeRoles };



