const express = require("express");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { asyncHandler } = require("../../frontend/src/utils/asyncHandler");
const {
  createQuotationHandler,
  getQuotationsForRequestHandler,
  acceptQuotationHandler
} = require("../controllers/quotationController");

const router = express.Router();

router.post("/", authenticate, authorizeRoles("MECHANIC"), asyncHandler(createQuotationHandler));
router.get("/request/:requestId", authenticate, authorizeRoles("CUSTOMER", "MECHANIC", "ADMIN"), asyncHandler(getQuotationsForRequestHandler));
router.post("/:quotationId/accept", authenticate, authorizeRoles("CUSTOMER"), asyncHandler(acceptQuotationHandler));

module.exports = router;



