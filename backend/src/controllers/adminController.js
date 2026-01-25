const adminService = require("../services/adminService");

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

module.exports = {
  listWorkshopsHandler,
  createWorkshopHandler,
  updateWorkshopHandler,
  deleteWorkshopHandler,
  listUsersHandler
};
