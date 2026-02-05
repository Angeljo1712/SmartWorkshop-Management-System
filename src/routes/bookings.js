const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { saveBookingDetailsHandler } = require("../controllers/bookingsController");

const router = express.Router();

router.post("/details", asyncHandler(saveBookingDetailsHandler));

module.exports = router;
