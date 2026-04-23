const serviceRequestService = require("../services/service-requests.service");
const { AppError } = require("../../../shared/utils/appError");

const createRequestHandler = async (req, res) => {
  const request = await serviceRequestService.createRequest(req.user.userId, req.body);
  res.status(201).json(request);
};

const getMyRequestsHandler = async (req, res) => {
  const requests = await serviceRequestService.getRequestsForCustomer(req.user.userId);
  res.json(requests);
};

const getRequestByIdHandler = async (req, res) => {
  const request = await serviceRequestService.getRequestById(Number(req.params.id));
  if (!request) {
    throw new AppError("REQUEST_NOT_FOUND", "Service request not found", 404);
  }
  const roles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.role];
  if (!roles.includes("ADMIN") && request.customer_id !== req.user.userId) {
    throw new AppError("FORBIDDEN", "Access denied", 403);
  }
  res.json(request);
};

const getAvailableRequestsHandler = async (_req, res) => {
  const requests = await serviceRequestService.getAvailableRequests();
  res.json(requests);
};

module.exports = {
  createRequestHandler,
  getMyRequestsHandler,
  getRequestByIdHandler,
  getAvailableRequestsHandler
};



