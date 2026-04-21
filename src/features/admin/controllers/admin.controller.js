const adminService = require("../services/admin.service");
const authService = require("../../auth/services/auth.service");
const userService = require("../../user/services/user.service");
const { AppError } = require("../../../shared/utils/appError");
const {
  sendAccountChangeNotification,
  sendEmailChangeConfirmation
} = require("../../../shared/infrastructure/email/email.service");
const { env } = require("../../../shared/config/env");

const listWorkshopsHandler = async (_req, res) => {
  const workshops = await adminService.listWorkshops();
  res.json(workshops);
};

const createWorkshopHandler = async (req, res) => {
  const workshop = await adminService.createWorkshop(req.body);
  res.status(201).json(workshop);
};

const updateWorkshopHandler = async (req, res) => {
  const workshop = await adminService.updateWorkshop(Number(req.params.workshopId), req.body);
  res.json(workshop);
};

const deleteWorkshopHandler = async (req, res) => {
  const result = await adminService.deleteWorkshop(Number(req.params.workshopId));
  res.json(result);
};

const listUsersHandler = async (_req, res) => {
  const users = await adminService.listUsers();
  res.json(users);
};

const listApplicationsHandler = async (_req, res) => {
  const applications = await adminService.listApplications();
  res.json(applications);
};

const listApplicationDocumentsHandler = async (req, res) => {
  const documents = await adminService.listApplicationDocuments(Number(req.params.userId));
  res.json(documents);
};

const requestUserEmailChangeHandler = async (req, res) => {
  const userId = Number(req.params.userId);
  const { email } = req.body || {};
  const newEmail = String(email || "").trim();
  const result = await userService.requestEmailChange(userId, newEmail);
  const confirmUrl = `${env.appBaseUrl}/auth/confirm-email?token=${result.token}`;
  await sendEmailChangeConfirmation({ to: newEmail, confirmUrl });
  res.json({ message: "Confirmation email sent." });
};

const updateApplicationStatusHandler = async (req, res) => {
  const userId = Number(req.params.userId);
  const { action, note } = req.body || {};
  const previousApplications = await adminService.listApplications();
  const previous = previousApplications.find((item) => Number(item.user_id) === Number(userId)) || null;
  const result = await adminService.updateApplicationStatus({ userId, action, note });
  if (previous?.email && result) {
    try {
      await sendAccountChangeNotification({
        to: previous.email,
        title: "SmartWorkshop - Application status changed",
        changes: ["Application status"]
      });
    } catch (error) {
      console.error("Unable to send application status notification", error);
    }
  }
  res.json(result);
};

const listBookingsHandler = async (_req, res) => {
  const bookings = await adminService.listBookings();
  res.json(bookings);
};

const updateBookingStatusHandler = async (req, res) => {
  const bookingId = Number(req.params.bookingId);
  const { action } = req.body || {};
  const result = await adminService.updateBookingStatus({ bookingId, action });
  res.json(result);
};

const listResolutionCasesHandler = async (_req, res) => {
  const cases = await adminService.listResolutionCases();
  res.json(cases);
};

const getResolutionCaseHandler = async (req, res) => {
  const detail = await adminService.getResolutionCaseDetail(Number(req.params.caseId));
  res.json(detail);
};

const addResolutionCaseMessageHandler = async (req, res) => {
  const detail = await adminService.addResolutionCaseMessage({
    adminId: req.user.userId,
    caseId: Number(req.params.caseId),
    body: req.body?.body
  });
  res.json(detail);
};

const listContactMessagesHandler = async (_req, res) => {
  const messages = await adminService.listContactMessages();
  res.json(messages);
};

const updateContactMessageStatusHandler = async (req, res) => {
  const messageId = Number(req.params.messageId);
  const { action } = req.body || {};
  const result = await adminService.updateContactMessageStatus({ messageId, action });
  res.json(result);
};

const updateResolutionCaseStatusHandler = async (req, res) => {
  const caseId = Number(req.params.caseId);
  const { action } = req.body || {};
  const result = await adminService.updateResolutionCaseStatus({ caseId, action });
  res.json(result);
};

const getDashboardSummaryHandler = async (_req, res) => {
  const summary = await adminService.getDashboardSummary();
  res.json(summary);
};

const listPaymentsHandler = async (_req, res) => {
  const payments = await adminService.listPayments();
  res.json(payments);
};

const updatePaymentStatusHandler = async (req, res) => {
  const recordId = Number(req.params.recordId);
  const { kind, action } = req.body || {};
  const result = await adminService.updatePaymentStatus({ kind, recordId, action });
  res.json(result);
};

const getPaymentDetailHandler = async (req, res) => {
  const recordId = Number(req.params.recordId);
  const kind = String(req.query.kind || "").trim();
  const result = await adminService.getPaymentDetail({ kind, recordId });
  res.json(result);
};

const addPaymentAdminNoteHandler = async (req, res) => {
  const recordId = Number(req.params.recordId);
  const { kind, note } = req.body || {};
  const result = await adminService.addPaymentAdminNote({
    adminId: req.user.userId,
    kind,
    recordId,
    note
  });
  res.json(result);
};

const updateCatalogServiceOrderHandler = async (req, res) => {
  const serviceId = Number(req.params.serviceId);
  const { direction } = req.body || {};
  const result = await adminService.updateCatalogServiceOrder({ serviceId, direction });
  res.json(result);
};

const updateCatalogServiceHandler = async (req, res) => {
  const serviceId = Number(req.params.serviceId);
  const { name, description, base_labour_minutes, price, region } = req.body || {};
  const result = await adminService.updateCatalogService({
    serviceId,
    name,
    description,
    base_labour_minutes,
    price,
    region
  });
  res.json(result);
};

const createCatalogServiceHandler = async (req, res) => {
  const { groupKey, name, region } = req.body || {};
  const result = await adminService.createCatalogService({ groupKey, name, region });
  res.status(201).json(result);
};

const deleteCatalogServiceHandler = async (req, res) => {
  const serviceId = Number(req.params.serviceId);
  const result = await adminService.deleteCatalogService({ serviceId });
  res.json(result);
};

const createUserHandler = async (req, res) => {
  const { user } = await authService.register(req.body);
  res.status(201).json(user);
};

const setUserRoleHandler = async (req, res) => {
  const userId = Number(req.params.userId);
  const { role, action } = req.body || {};
  const previousUsers = await adminService.listUsers();
  const previous = previousUsers.find((item) => Number(item.user_id) === Number(userId)) || null;
  const result = await adminService.setUserRole({ userId, role, action });
  if (previous?.email && result) {
    try {
      await sendAccountChangeNotification({
        to: previous.email,
        title: "SmartWorkshop - Role changed",
        changes: ["Role"]
      });
    } catch (error) {
      console.error("Unable to send role change notification", error);
    }
  }
  res.json(result);
};

const setUserStatusHandler = async (req, res) => {
  const userId = Number(req.params.userId);
  const { status } = req.body || {};
  const previousUsers = await adminService.listUsers();
  const previous = previousUsers.find((item) => Number(item.user_id) === Number(userId)) || null;
  const result = await adminService.setUserStatus({ userId, status });
  if (previous?.email && result) {
    try {
      await sendAccountChangeNotification({
        to: previous.email,
        title: "SmartWorkshop - Status changed",
        changes: ["Status"]
      });
    } catch (error) {
      console.error("Unable to send status change notification", error);
    }
  }
  res.json(result);
};

const updateUserHandler = async (req, res) => {
  const userId = Number(req.params.userId);
  if (req.body?.email !== undefined) {
    throw new AppError("EMAIL_CHANGE_REQUIRES_CONFIRMATION", "Email changes require confirmation.", 400);
  }
  const previousUsers = await adminService.listUsers();
  const previous = previousUsers.find((item) => Number(item.user_id) === Number(userId)) || null;
  const result = await adminService.updateUser({ userId, ...req.body });
  if (previous?.email && result) {
    const changes = [];
    if (req.body?.full_name !== undefined && String(req.body.full_name || "").trim() !== String(previous.full_name || "").trim()) {
      changes.push("Full name");
    }
    if (req.body?.phone !== undefined && String(req.body.phone || "").trim() !== String(previous.phone || "").trim()) {
      changes.push("Phone");
    }
    if (req.body?.username !== undefined && String(req.body.username || "").trim().toLowerCase() !== String(previous.username || "").trim().toLowerCase()) {
      changes.push("Username");
    }
    if (req.body?.email !== undefined && String(req.body.email || "").trim().toLowerCase() !== String(previous.email || "").trim().toLowerCase()) {
      changes.push("Email");
    }
    if (req.body?.address !== undefined && String(req.body.address || "").trim() !== String(previous.address || "").trim()) {
      changes.push("Address");
    }
    if (req.body?.role !== undefined && String(req.body.role || "").trim().toLowerCase() !== String(previous.role_name || "").trim().toLowerCase()) {
      changes.push("Role");
    }
    if (req.body?.status !== undefined && String(req.body.status || "").trim().toLowerCase() !== String(previous.status || "").trim().toLowerCase()) {
      changes.push("Status");
    }
    if (changes.length) {
      try {
        await sendAccountChangeNotification({
          to: previous.email,
          title: "SmartWorkshop - Account details changed by administrator",
          changes
        });
      } catch (error) {
        console.error("Unable to send admin account change notification", error);
      }
    }
  }
  res.json(result);
};

const deleteUserHandler = async (req, res) => {
  const userId = Number(req.params.userId);
  const result = await adminService.deleteUser({ userId });
  res.json(result);
};

module.exports = {
  listWorkshopsHandler,
  createWorkshopHandler,
  updateWorkshopHandler,
  deleteWorkshopHandler,
  listUsersHandler,
  listApplicationsHandler,
  listApplicationDocumentsHandler,
  requestUserEmailChangeHandler,
  updateApplicationStatusHandler,
  listBookingsHandler,
  updateBookingStatusHandler,
  listResolutionCasesHandler,
  getResolutionCaseHandler,
  addResolutionCaseMessageHandler,
  listContactMessagesHandler,
  updateContactMessageStatusHandler,
  updateResolutionCaseStatusHandler,
  getDashboardSummaryHandler,
  listPaymentsHandler,
  getPaymentDetailHandler,
  addPaymentAdminNoteHandler,
  updatePaymentStatusHandler,
  createCatalogServiceHandler,
  updateCatalogServiceHandler,
  updateCatalogServiceOrderHandler,
  deleteCatalogServiceHandler,
  createUserHandler,
  setUserRoleHandler,
  setUserStatusHandler,
  updateUserHandler,
  deleteUserHandler
};
