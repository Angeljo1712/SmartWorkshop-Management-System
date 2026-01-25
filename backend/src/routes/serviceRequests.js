const express = require("express");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  createRequestHandler,
  getMyRequestsHandler,
  getRequestByIdHandler,
  getAvailableRequestsHandler
} = require("../controllers/serviceRequestController");

const router = express.Router();

router.post("/", authenticate, authorizeRoles("CUSTOMER"), asyncHandler(createRequestHandler));
router.get("/me", authenticate, authorizeRoles("CUSTOMER"), asyncHandler(getMyRequestsHandler));
router.get("/available", authenticate, authorizeRoles("MECHANIC", "ADMIN"), asyncHandler(getAvailableRequestsHandler));
router.get("/:id", authenticate, authorizeRoles("CUSTOMER", "ADMIN"), asyncHandler(getRequestByIdHandler));

module.exports = router;
