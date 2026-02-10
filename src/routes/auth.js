const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  registerHandler,
  loginHandler,
  requestPasswordResetHandler,
  resetPasswordHandler,
  checkEmailHandler
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", asyncHandler(registerHandler));
router.post("/login", asyncHandler(loginHandler));
router.post("/password-reset-request", asyncHandler(requestPasswordResetHandler));
router.post("/password-reset", asyncHandler(resetPasswordHandler));
router.get("/check-email", asyncHandler(checkEmailHandler));

module.exports = router;



