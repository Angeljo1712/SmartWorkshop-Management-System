const quotationService = require("../services/quotationService");
const serviceRequestService = require("../services/serviceRequestService");
const { AppError } = require("../utils/appError");

const createQuotationHandler = async (req, res) => {
  const quotation = await quotationService.createQuotation(req.user.userId, req.body);
  res.status(201).json(quotation);
};

const getQuotationsForRequestHandler = async (req, res) => {
  const requestId = Number(req.params.requestId);
  const request = await serviceRequestService.getRequestById(requestId);
  if (!request) {
    throw new AppError("REQUEST_NOT_FOUND", "Service request not found", 404);
  }

  if (req.user.role === "CUSTOMER" && request.customer_id !== req.user.userId) {
    throw new AppError("FORBIDDEN", "Access denied", 403);
  }

  const quotations = await quotationService.getQuotationsForRequest(requestId);

  if (req.user.role === "MECHANIC") {
    const workshopId = await quotationService.getWorkshopIdForMechanic(req.user.userId);
    if (!workshopId) {
      throw new AppError("FORBIDDEN", "Mechanic must belong to a workshop", 403);
    }
    return res.json(quotations.filter((quotation) => quotation.workshop_id === workshopId));
  }

  return res.json(quotations);
};

const acceptQuotationHandler = async (req, res) => {
  const result = await quotationService.acceptQuotation(Number(req.params.quotationId), req.user.userId);
  res.json(result);
};

module.exports = {
  createQuotationHandler,
  getQuotationsForRequestHandler,
  acceptQuotationHandler
};
