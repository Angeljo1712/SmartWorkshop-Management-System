const { register, login, requestPasswordReset, resetPassword } = require("../services/authService");
const { sendPasswordResetEmail } = require("../services/emailService");
const { env } = require("../config/env");

const registerHandler = async (req, res) => {
  const result = await register(req.body);
  res.status(201).json(result);
};

const loginHandler = async (req, res) => {
  const result = await login(req.body);
  res.json(result);
};

const requestPasswordResetHandler = async (req, res) => {
  const { email } = req.body || {};
  const result = await requestPasswordReset(String(email || "").trim());
  const resetUrl = `${env.appBaseUrl}/pages/Auth/reset-password.html?token=${result.token}`;
  await sendPasswordResetEmail({ to: result.email, resetUrl });
  res.json({ message: "Password reset email sent." });
};

const resetPasswordHandler = async (req, res) => {
  const { token, password } = req.body || {};
  await resetPassword({ token, password });
  res.json({ message: "Password updated." });
};

module.exports = { registerHandler, loginHandler, requestPasswordResetHandler, resetPasswordHandler };
