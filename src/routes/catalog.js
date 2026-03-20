const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { listServicesHandler, listServiceTreeHandler } = require("../controllers/catalogController");

const router = express.Router();

router.get("/services", asyncHandler(listServicesHandler));
router.get("/services-tree", asyncHandler(listServiceTreeHandler));

module.exports = router;
