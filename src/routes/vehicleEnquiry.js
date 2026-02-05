const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { vehicleEnquiryHandler } = require("../controllers/vehicleEnquiryController");

const router = express.Router();

router.post("/", asyncHandler(vehicleEnquiryHandler));

module.exports = router;

