const express = require("express");
const { asyncHandler } = require("../../../shared/utils/asyncHandler");
const { createContactMessageHandler } = require("../controllers/contact.controller");

const router = express.Router();

router.post("/", asyncHandler(createContactMessageHandler));

module.exports = router;
