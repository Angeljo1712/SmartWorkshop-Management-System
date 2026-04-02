const express = require("express");
const { authenticate, authorizeRoles } = require("../../../shared/middleware/auth");
const { asyncHandler } = require("../../../shared/utils/asyncHandler");
const {
  createQuotationHandler,
  getQuotationsForRequestHandler,
  acceptQuotationHandler
} = require("../controllers/quotation.controller");

const router = express.Router();

router.post("/", authenticate, authorizeRoles("MECHANIC"), asyncHandler(createQuotationHandler));
router.get("/request/:requestId", authenticate, authorizeRoles("CUSTOMER", "MECHANIC", "ADMIN"), asyncHandler(getQuotationsForRequestHandler));
router.post("/:quotationId/accept", authenticate, authorizeRoles("CUSTOMER"), asyncHandler(acceptQuotationHandler));

module.exports = router;



