const { AppError } = require("../utils/appError");
const userService = require("../services/userService");
const { sendEmailChangeConfirmation } = require("../services/emailService");
const { env } = require("../config/env");

const getMeHandler = async (req, res) => {
  const user = await userService.getUserById(req.user.userId);
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }
  res.json(user);
};

const updateMeHandler = async (req, res) => {
  const { name, lastname, full_name, phone } = req.body || {};
  const user = await userService.updateUserProfile(req.user.userId, { name, lastname, full_name, phone });
  res.json(user);
};

const uploadAvatarHandler = async (req, res) => {
  if (!req.file) {
    throw new AppError("INVALID_FILE", "No image uploaded", 400);
  }
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  const user = await userService.updateUserAvatar(req.user.userId, avatarUrl);
  res.json(user);
};

const requestEmailChangeHandler = async (req, res) => {
  const { email } = req.body || {};
  const result = await userService.requestEmailChange(req.user.userId, String(email || "").trim());
  const confirmUrl = `${env.appBaseUrl}/pages/Auth/confirm-email.html?token=${result.token}`;
  await sendEmailChangeConfirmation({ to: email, confirmUrl });
  res.json({ message: "Confirmation email sent." });
};

const confirmEmailChangeHandler = async (req, res) => {
  const token = String(req.query.token || "");
  const user = await userService.confirmEmailChange(token);
  res.json({ message: "Email updated.", user });
};

module.exports = {
  getMeHandler,
  updateMeHandler,
  uploadAvatarHandler,
  requestEmailChangeHandler,
  confirmEmailChangeHandler
};
