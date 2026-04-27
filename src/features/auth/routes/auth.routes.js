const express = require("express");
const { asyncHandler } = require("../../../shared/utils/asyncHandler");
const {
  registerHandler,
  loginHandler,
  resendTwoFactorLoginCodeHandler,
  verifyTwoFactorLoginHandler,
  requestPasswordResetHandler,
  resetPasswordHandler,
  checkEmailHandler
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", asyncHandler(registerHandler));
router.post("/login", asyncHandler(loginHandler));
router.post("/login/resend-2fa", asyncHandler(resendTwoFactorLoginCodeHandler));
router.post("/login/verify-2fa", asyncHandler(verifyTwoFactorLoginHandler));
router.post("/password-reset-request", asyncHandler(requestPasswordResetHandler));
router.post("/password-reset", asyncHandler(resetPasswordHandler));
router.get("/check-email", asyncHandler(checkEmailHandler));

module.exports = router;



