const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { AppError } = require("../utils/appError");

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

const authorizeRoles = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError("FORBIDDEN", "Insufficient permissions", 403));
  }
  return next();
};

module.exports = { authenticate, authorizeRoles };



