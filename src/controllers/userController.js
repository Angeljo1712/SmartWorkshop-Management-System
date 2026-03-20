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

const changePasswordHandler = async (req, res) => {
  const { old_password, new_password } = req.body || {};
  const result = await userService.changeUserPassword(req.user.userId, { old_password, new_password });
  res.json(result);
};

const updateMeHandler = async (req, res) => {
  const { name, lastname, full_name, phone, username, address } = req.body || {};
  const user = await userService.updateUserProfile(req.user.userId, {
    name,
    lastname,
    full_name,
    phone,
    username,
    address
  });
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

const listMyVehiclesHandler = async (req, res) => {
  const vehicles = await userService.listUserVehicles(req.user.userId);
  res.json(vehicles);
};

const addMyVehicleHandler = async (req, res) => {
  const vehicle = await userService.saveUserVehicle(req.user.userId, req.body || {});
  res.status(201).json(vehicle);
};

const deleteMyVehicleHandler = async (req, res) => {
  const registrationNumber = String(req.params.registrationNumber || "");
  const result = await userService.deleteUserVehicle(req.user.userId, registrationNumber);
  res.json(result);
};

const listMyBookingsHandler = async (req, res) => {
  const bookings = await userService.listUserBookings(req.user.userId);
  res.json(bookings);
};

const listMyMechanicOffersHandler = async (req, res) => {
  const offers = await userService.listMechanicBookingOffers(req.user.userId);
  res.json(offers);
};

const listMyMechanicAssignedBookingsHandler = async (req, res) => {
  const bookings = await userService.listMechanicAssignedBookings(req.user.userId);
  res.json(bookings);
};

const listMyMechanicServiceCoverageHandler = async (req, res) => {
  const coverage = await userService.listMechanicServiceCoverage(req.user.userId);
  res.json(coverage);
};

const listMyResolutionCasesHandler = async (req, res) => {
  const bookingId = req.query.booking_id;
  const cases = await userService.listUserResolutionCases(req.user.userId, { bookingId });
  res.json(cases);
};

const openMyResolutionCaseHandler = async (req, res) => {
  const caseId = await userService.openUserResolutionCase(req.user.userId, req.body || {});
  const detail = await userService.getUserResolutionCaseDetail(req.user.userId, caseId);
  res.status(201).json(detail);
};

const getMyResolutionCaseHandler = async (req, res) => {
  const detail = await userService.getUserResolutionCaseDetail(req.user.userId, req.params.caseId);
  res.json(detail);
};

const addMyResolutionMessageHandler = async (req, res) => {
  const detail = await userService.addUserResolutionMessage(req.user.userId, req.params.caseId, req.body?.body);
  res.json(detail);
};

const listMyMechanicResolutionCasesHandler = async (req, res) => {
  const bookingId = req.query.booking_id;
  const cases = await userService.listMechanicResolutionCases(req.user.userId, { bookingId });
  res.json(cases);
};

const openMyMechanicResolutionCaseHandler = async (req, res) => {
  const caseId = await userService.openMechanicResolutionCase(req.user.userId, req.body || {});
  const detail = await userService.getMechanicResolutionCaseDetail(req.user.userId, caseId);
  res.status(201).json(detail);
};

const getMyMechanicResolutionCaseHandler = async (req, res) => {
  const detail = await userService.getMechanicResolutionCaseDetail(req.user.userId, req.params.caseId);
  res.json(detail);
};

const addMyMechanicResolutionMessageHandler = async (req, res) => {
  const detail = await userService.addMechanicResolutionMessage(req.user.userId, req.params.caseId, req.body?.body);
  res.json(detail);
};

const getMyMechanicProfileHandler = async (req, res) => {
  const profile = await userService.getMechanicProfile(req.user.userId);
  if (!profile) {
    throw new AppError("NOT_FOUND", "Mechanic profile not found", 404);
  }
  res.json(profile);
};

const updateMyMechanicProfileHandler = async (req, res) => {
  const profile = await userService.updateMechanicProfile(req.user.userId, req.body || {});
  res.json(profile);
};

const updateMyMechanicServiceCoverageHandler = async (req, res) => {
  const coverage = await userService.updateMechanicServiceCoverage(req.user.userId, req.body || {});
  res.json(coverage);
};

const respondMyMechanicOfferHandler = async (req, res) => {
  const offerId = Number(req.params.offerId);
  const action = String(req.body?.action || "");
  const result = await userService.respondToMechanicBookingOffer(req.user.userId, offerId, action);
  res.json(result);
};

module.exports = {
  getMeHandler,
  changePasswordHandler,
  updateMeHandler,
  uploadAvatarHandler,
  requestEmailChangeHandler,
  confirmEmailChangeHandler,
  listMyVehiclesHandler,
  addMyVehicleHandler,
  deleteMyVehicleHandler,
  listMyBookingsHandler,
  listMyMechanicOffersHandler,
  listMyMechanicAssignedBookingsHandler,
  listMyMechanicServiceCoverageHandler,
  listMyResolutionCasesHandler,
  openMyResolutionCaseHandler,
  getMyResolutionCaseHandler,
  addMyResolutionMessageHandler,
  listMyMechanicResolutionCasesHandler,
  openMyMechanicResolutionCaseHandler,
  getMyMechanicResolutionCaseHandler,
  addMyMechanicResolutionMessageHandler,
  getMyMechanicProfileHandler,
  updateMyMechanicProfileHandler,
  updateMyMechanicServiceCoverageHandler,
  respondMyMechanicOfferHandler
};
