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

module.exports = {
  listWorkshopsHandler,
  createWorkshopHandler,
  updateWorkshopHandler,
  deleteWorkshopHandler,
  listUsersHandler,
  createUserHandler,
  setUserRoleHandler
};
