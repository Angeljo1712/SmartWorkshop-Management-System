const adminService = require("../services/adminService");
const authService = require("../services/authService");

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

const updateApplicationStatusHandler = async (req, res) => {
  const userId = Number(req.params.userId);
  const { action } = req.body || {};
  const result = await adminService.updateApplicationStatus({ userId, action });
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

const updateCatalogServiceOrderHandler = async (req, res) => {
  const serviceId = Number(req.params.serviceId);
  const { direction } = req.body || {};
  const result = await adminService.updateCatalogServiceOrder({ serviceId, direction });
  res.json(result);
};

const createUserHandler = async (req, res) => {
  const { user } = await authService.register(req.body);
  res.status(201).json(user);
};

const setUserRoleHandler = async (req, res) => {
  const userId = Number(req.params.userId);
  const { role, action } = req.body || {};
  const result = await adminService.setUserRole({ userId, role, action });
  res.json(result);
};

const setUserStatusHandler = async (req, res) => {
  const userId = Number(req.params.userId);
  const { status } = req.body || {};
  const result = await adminService.setUserStatus({ userId, status });
  res.json(result);
};

module.exports = {
  listWorkshopsHandler,
  createWorkshopHandler,
  updateWorkshopHandler,
  deleteWorkshopHandler,
  listUsersHandler,
  listApplicationsHandler,
  updateApplicationStatusHandler,
  listBookingsHandler,
  updateBookingStatusHandler,
  listResolutionCasesHandler,
  updateResolutionCaseStatusHandler,
  getDashboardSummaryHandler,
  listPaymentsHandler,
  updatePaymentStatusHandler,
  updateCatalogServiceOrderHandler,
  createUserHandler,
  setUserRoleHandler,
  setUserStatusHandler
};
