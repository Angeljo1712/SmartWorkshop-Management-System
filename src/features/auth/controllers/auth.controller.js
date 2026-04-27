const {
  register,
  login,
  resendTwoFactorLoginCode,
  verifyTwoFactorLogin,
  requestPasswordReset,
  resetPassword
} = require("../services/auth.service");
const { checkEmailExists } = require("../services/auth.service");
const { sendPasswordResetEmail } = require("../../../shared/infrastructure/email/email.service");
const { env } = require("../../../shared/config/env");

const registerHandler = async (req, res) => {
  const result = await register(req.body);
  res.status(201).json(result);
};

const loginHandler = async (req, res) => {
  const result = await login(req.body);
  res.json(result);
};

const verifyTwoFactorLoginHandler = async (req, res) => {
  const { challenge_token, code } = req.body || {};
  const result = await verifyTwoFactorLogin({ challenge_token, code });
  res.json(result);
};

const resendTwoFactorLoginCodeHandler = async (req, res) => {
  const { challenge_token } = req.body || {};
  const result = await resendTwoFactorLoginCode({ challenge_token });
  res.json(result);
};

const requestPasswordResetHandler = async (req, res) => {
  const { email } = req.body || {};
  const result = await requestPasswordReset(String(email || "").trim());
  const resetUrl = `${env.appBaseUrl}/auth/reset-password?token=${result.token}`;
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) {
    return res.json({
      message: "SMTP not configured. Use the reset link directly.",
      resetUrl
    });
  }
  try {
    await sendPasswordResetEmail({ to: result.email, resetUrl });
    return res.json({ message: "Password reset email sent." });
  } catch (err) {
    console.error("Password reset email failed:", err);
    return res.json({
      message: "Email failed to send. Use the reset link directly.",
      resetUrl
    });
  }
};

const resetPasswordHandler = async (req, res) => {
  const { token, password } = req.body || {};
  await resetPassword({ token, password });
  res.json({ message: "Password updated." });
};

const checkEmailHandler = async (req, res) => {
  const email = req.query.email || "";
  const result = await checkEmailExists(email);
  res.json(result);
};

module.exports = {
  registerHandler,
  loginHandler,
  resendTwoFactorLoginCodeHandler,
  verifyTwoFactorLoginHandler,
  requestPasswordResetHandler,
  resetPasswordHandler,
  checkEmailHandler
};

