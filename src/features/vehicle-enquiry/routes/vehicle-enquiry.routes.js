const express = require("express");
const { asyncHandler } = require("../../../shared/utils/asyncHandler");
const { vehicleEnquiryHandler } = require("../controllers/vehicle-enquiry.controller");

const router = express.Router();

router.post("/", asyncHandler(vehicleEnquiryHandler));

module.exports = router;

