const express = require("express");
const { authenticate } = require("../middlewares/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const { uploadAvatar } = require("../middlewares/upload");
const {
  getMeHandler,
  updateMeHandler,
  uploadAvatarHandler,
  requestEmailChangeHandler,
  confirmEmailChangeHandler,
  listMyVehiclesHandler,
  addMyVehicleHandler,
  deleteMyVehicleHandler
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", authenticate, asyncHandler(getMeHandler));
router.patch("/me", authenticate, asyncHandler(updateMeHandler));
router.post("/me/avatar", authenticate, uploadAvatar.single("avatar"), asyncHandler(uploadAvatarHandler));
router.post("/me/email-change", authenticate, asyncHandler(requestEmailChangeHandler));
router.get("/me/vehicles", authenticate, asyncHandler(listMyVehiclesHandler));
router.post("/me/vehicles", authenticate, asyncHandler(addMyVehicleHandler));
router.delete("/me/vehicles/:registrationNumber", authenticate, asyncHandler(deleteMyVehicleHandler));
router.get("/confirm-email", asyncHandler(confirmEmailChangeHandler));

module.exports = router;
