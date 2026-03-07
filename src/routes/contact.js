const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { createContactMessageHandler } = require("../controllers/contactController");

const router = express.Router();

router.post("/", asyncHandler(createContactMessageHandler));

module.exports = router;
