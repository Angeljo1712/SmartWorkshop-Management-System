const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { listServicesHandler } = require("../controllers/catalogController");

const router = express.Router();

router.get("/services", asyncHandler(listServicesHandler));

module.exports = router;
