const { createContactMessage } = require("../services/contact.service");

const getIpAddress = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || null;
};

const createContactMessageHandler = async (req, res) => {
  const { name, email, subject, message, source } = req.body || {};
  const result = await createContactMessage({
    name,
    email,
    subject,
    message,
    source,
    ipAddress: getIpAddress(req),
    userAgent: req.headers["user-agent"] || null
  });

  res.status(201).json({
    message: "Contact message saved.",
    contact_message_id: result.id
  });
};

module.exports = { createContactMessageHandler };
