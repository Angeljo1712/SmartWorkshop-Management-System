const express = require("express");
const { asyncHandler } = require("../../../shared/utils/asyncHandler");
const { listServicesHandler, listServiceTreeHandler } = require("../controllers/catalog.controller");

const router = express.Router();

router.get("/services", asyncHandler(listServicesHandler));
router.get("/services-tree", asyncHandler(listServiceTreeHandler));

module.exports = router;
