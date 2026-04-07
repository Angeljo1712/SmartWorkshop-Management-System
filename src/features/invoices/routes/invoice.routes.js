const express = require("express");
const { authenticate, authorizeRoles } = require("../../../shared/middleware/auth");
const { asyncHandler } = require("../../../shared/utils/asyncHandler");
const { getBookingInvoiceHandler } = require("../controllers/invoice.controller");

const router = express.Router();

router.get(
  "/bookings/:bookingId",
  authenticate,
  authorizeRoles("CUSTOMER", "USER", "MECHANIC", "ADMIN"),
  asyncHandler(getBookingInvoiceHandler)
);

module.exports = router;
