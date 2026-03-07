const { query } = require("../config/db");
const { AppError } = require("../utils/appError");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeText = (value) => String(value || "").trim();

const createContactMessage = async ({
  name,
  email,
  subject,
  message,
  source = "home_web",
  ipAddress = null,
  userAgent = null
}) => {
  const cleanName = normalizeText(name);
  const cleanEmail = normalizeText(email).toLowerCase();
  const cleanSubject = normalizeText(subject) || null;
  const cleanMessage = normalizeText(message);

  if (!cleanName) {
    throw new AppError("VALIDATION_ERROR", "name is required", 400);
  }
  if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
    throw new AppError("VALIDATION_ERROR", "valid email is required", 400);
  }
  if (!cleanMessage) {
    throw new AppError("VALIDATION_ERROR", "message is required", 400);
  }

  const result = await query(
    `
      INSERT INTO contact_messages (name, email, subject, message, source, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [cleanName, cleanEmail, cleanSubject, cleanMessage, normalizeText(source) || "home_web", ipAddress, userAgent]
  );

  return { id: result.insertId };
};

module.exports = { createContactMessage };
