const express = require("express");
const { authenticate } = require("../middleware/auth");
const { asyncHandler } = require("../../frontend/src/utils/asyncHandler");
const { uploadAvatar } = require("../middleware/upload");
const {
  getMeHandler,
  updateMeHandler,
  uploadAvatarHandler,
  requestEmailChangeHandler,
  confirmEmailChangeHandler
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", authenticate, asyncHandler(getMeHandler));
router.patch("/me", authenticate, asyncHandler(updateMeHandler));
router.post("/me/avatar", authenticate, uploadAvatar.single("avatar"), asyncHandler(uploadAvatarHandler));
router.post("/me/email-change", authenticate, asyncHandler(requestEmailChangeHandler));
router.get("/confirm-email", asyncHandler(confirmEmailChangeHandler));

module.exports = router;
