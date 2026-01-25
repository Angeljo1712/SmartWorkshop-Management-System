const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { registerHandler, loginHandler } = require("../controllers/authController");

const router = express.Router();

router.post("/register", asyncHandler(registerHandler));
router.post("/login", asyncHandler(loginHandler));

module.exports = router;
