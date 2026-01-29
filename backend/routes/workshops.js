const express = require("express");
const { asyncHandler } = require("../../frontend/src/utils/asyncHandler");
const { getNearbyWorkshopsHandler } = require("../controllers/workshopController");

const router = express.Router();

router.get("/nearby", asyncHandler(getNearbyWorkshopsHandler));

module.exports = router;
