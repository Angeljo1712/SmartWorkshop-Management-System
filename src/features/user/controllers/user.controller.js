const { AppError } = require("../../../shared/utils/appError");
const userService = require("../services/user.service");
const {
  sendEmailChangeConfirmation,
  sendAccountChangeNotification
} = require("../../../shared/infrastructure/email/email.service");
const { env } = require("../../../shared/config/env");

const getMeHandler = async (req, res) => {
  const user = await userService.getUserById(req.user.userId);
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }
  res.json(user);
};

const changePasswordHandler = async (req, res) => {
  const { old_password, new_password } = req.body || {};
  const currentUser = await userService.getUserById(req.user.userId);
  const result = await userService.changeUserPassword(req.user.userId, { old_password, new_password });
  if (currentUser?.email) {
    await sendAccountChangeNotification({
      to: currentUser.email,
      title: "SmartWorkshop - Password changed",
      changes: ["Password"]
    });
  }
  res.json(result);
};

const updateMeHandler = async (req, res) => {
  const { name, lastname, full_name, phone, username, address } = req.body || {};
  const currentUser = await userService.getUserById(req.user.userId);
  const user = await userService.updateUserProfile(req.user.userId, {
    name,
    lastname,
    full_name,
    phone,
    username,
    address
  });
  if (currentUser?.email) {
    const changes = [];
    if (phone !== undefined && String(phone || "").trim() !== String(currentUser.phone || "").trim()) {
      changes.push("Phone");
    }
    if (username !== undefined && String(username || "").trim().toLowerCase() !== String(currentUser.username || "").trim().toLowerCase()) {
      changes.push("Username");
    }
    if (address !== undefined) {
      changes.push("Address");
    }
    if (name !== undefined || lastname !== undefined || full_name !== undefined) {
      changes.push("Full name");
    }
    if (changes.length) {
      await sendAccountChangeNotification({
        to: currentUser.email,
        title: "SmartWorkshop - Account details changed",
        changes
      });
    }
  }
  res.json(user);
};

const updateSecuritySettingsHandler = async (req, res) => {
  const { two_factor_email_enabled } = req.body || {};
  const user = await userService.updateUserSecuritySettings(req.user.userId, { two_factor_email_enabled });
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
  const confirmUrl = `${env.appBaseUrl}/auth/confirm-email?token=${result.token}`;
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
  const detail = await userService.addUserResolutionMessage(
    req.user.userId,
    req.params.caseId,
    req.body?.body,
    req.files || []
  );
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
  const detail = await userService.addMechanicResolutionMessage(
    req.user.userId,
    req.params.caseId,
    req.body?.body,
    req.files || []
  );
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
  const currentUser = await userService.getUserById(req.user.userId);
  const previousProfile = await userService.getMechanicProfile(req.user.userId);
  const profile = await userService.updateMechanicProfile(req.user.userId, req.body || {});
  if (currentUser?.email && profile) {
    const changes = [];
    const next = req.body || {};
    const prev = previousProfile || {};
    if (next.years_experience !== undefined && String(next.years_experience || "").trim() !== String(prev.years_experience || "").trim()) {
      changes.push("Years of experience");
    }
    if (next.work_history !== undefined && String(next.work_history || "").trim() !== String(prev.work_history || "").trim()) {
      changes.push("Work history");
    }
    if (next.travel_radius_miles !== undefined && String(next.travel_radius_miles || "").trim() !== String(prev.travel_radius_miles || "").trim()) {
      changes.push("Travel radius");
    }
    if (next.is_mobile !== undefined && Boolean(next.is_mobile) !== Boolean(prev.is_mobile)) {
      changes.push("Mobile service");
    }
    const prevContact = prev.address || prev.contact_address || {};
    const nextContact = next.contact_address || {};
    if (next.contact_address && JSON.stringify(nextContact) !== JSON.stringify(prevContact)) {
      changes.push("Contact address");
    }
    const prevPremises = prev.premises_address || {};
    const nextPremises = next.premises_address || {};
    if (next.premises_address && JSON.stringify(nextPremises) !== JSON.stringify(prevPremises)) {
      changes.push("Premises address");
    }
    if (Array.isArray(next.services_offered) && JSON.stringify(next.services_offered) !== JSON.stringify(prev.services_offered || [])) {
      changes.push("Services offered");
    }
    if (changes.length) {
      await sendAccountChangeNotification({
        to: currentUser.email,
        title: "SmartWorkshop - Mechanic profile changed",
        changes
      });
    }
  }
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

const completeMyMechanicBookingHandler = async (req, res) => {
  const bookingId = Number(req.params.bookingId);
  const result = await userService.completeMechanicAssignedBooking(
    req.user.userId,
    bookingId,
    req.body || {},
    req.files || []
  );
  res.json(result);
};

module.exports = {
  getMeHandler,
  changePasswordHandler,
  updateMeHandler,
  updateSecuritySettingsHandler,
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
  respondMyMechanicOfferHandler,
  completeMyMechanicBookingHandler
};

