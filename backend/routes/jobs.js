const express = require("express");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { asyncHandler } = require("../../frontend/src/utils/asyncHandler");
const { getJobsMeHandler, updateJobStatusHandler, getJobHistoryHandler } = require("../controllers/jobController");

const router = express.Router();

router.get("/me", authenticate, authorizeRoles("CUSTOMER", "MECHANIC", "ADMIN"), asyncHandler(getJobsMeHandler));
router.patch("/:jobId/status", authenticate, authorizeRoles("MECHANIC", "ADMIN"), asyncHandler(updateJobStatusHandler));
router.get("/:jobId/history", authenticate, authorizeRoles("CUSTOMER", "MECHANIC", "ADMIN"), asyncHandler(getJobHistoryHandler));

module.exports = router;



