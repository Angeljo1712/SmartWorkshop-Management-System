const express = require("express");
const { asyncHandler } = require("../../../shared/utils/asyncHandler");
const { getNearbyWorkshopsHandler } = require("../controllers/workshop.controller");

const router = express.Router();

router.get("/nearby", asyncHandler(getNearbyWorkshopsHandler));

module.exports = router;
