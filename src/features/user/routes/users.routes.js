const express = require("express");
const { authenticate, authorizeRoles } = require("../../../shared/middleware/auth");
const { asyncHandler } = require("../../../shared/utils/asyncHandler");
const { uploadAvatar, uploadBookingCompletionPhotos } = require("../../../shared/middleware/upload");
const {
  getMeHandler,
  changePasswordHandler,
  updateMeHandler,
  updateSecuritySettingsHandler,
  uploadAvatarHandler,
  requestEmailChangeHandler,
  confirmEmailChangeHandler,
  listMyVehiclesHandler,
  addMyVehicleHandler,
  deleteMyVehicleHandler,
  listMyBookingsHandler,
  listMyMechanicOffersHandler,
  listMyMechanicAssignedBookingsHandler,
  listMyMechanicServiceCoverageHandler,
  listMyResolutionCasesHandler,
  openMyResolutionCaseHandler,
  getMyResolutionCaseHandler,
  addMyResolutionMessageHandler,
  listMyMechanicResolutionCasesHandler,
  openMyMechanicResolutionCaseHandler,
  getMyMechanicResolutionCaseHandler,
  addMyMechanicResolutionMessageHandler,
  getMyMechanicProfileHandler,
  updateMyMechanicProfileHandler,
  updateMyMechanicServiceCoverageHandler,
  respondMyMechanicOfferHandler,
  completeMyMechanicBookingHandler
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", authenticate, asyncHandler(getMeHandler));
router.patch("/me", authenticate, asyncHandler(updateMeHandler));
router.patch("/me/security/two-factor", authenticate, asyncHandler(updateSecuritySettingsHandler));
router.post("/me/change-password", authenticate, asyncHandler(changePasswordHandler));
router.post("/me/avatar", authenticate, uploadAvatar.single("avatar"), asyncHandler(uploadAvatarHandler));
router.post("/me/email-change", authenticate, asyncHandler(requestEmailChangeHandler));
router.get("/me/vehicles", authenticate, asyncHandler(listMyVehiclesHandler));
router.post("/me/vehicles", authenticate, asyncHandler(addMyVehicleHandler));
router.delete("/me/vehicles/:registrationNumber", authenticate, asyncHandler(deleteMyVehicleHandler));
router.get("/me/bookings", authenticate, asyncHandler(listMyBookingsHandler));
router.get("/me/resolution-cases", authenticate, asyncHandler(listMyResolutionCasesHandler));
router.post("/me/resolution-cases", authenticate, asyncHandler(openMyResolutionCaseHandler));
router.get("/me/resolution-cases/:caseId", authenticate, asyncHandler(getMyResolutionCaseHandler));
router.post("/me/resolution-cases/:caseId/messages", authenticate, asyncHandler(addMyResolutionMessageHandler));
router.get("/me/mechanic-offers", authenticate, authorizeRoles("MECHANIC"), asyncHandler(listMyMechanicOffersHandler));
router.get("/me/mechanic-bookings", authenticate, authorizeRoles("MECHANIC"), asyncHandler(listMyMechanicAssignedBookingsHandler));
router.get("/me/mechanic-service-coverage", authenticate, authorizeRoles("MECHANIC"), asyncHandler(listMyMechanicServiceCoverageHandler));
router.get("/me/mechanic-resolution-cases", authenticate, authorizeRoles("MECHANIC"), asyncHandler(listMyMechanicResolutionCasesHandler));
router.post("/me/mechanic-resolution-cases", authenticate, authorizeRoles("MECHANIC"), asyncHandler(openMyMechanicResolutionCaseHandler));
router.get("/me/mechanic-resolution-cases/:caseId", authenticate, authorizeRoles("MECHANIC"), asyncHandler(getMyMechanicResolutionCaseHandler));
router.post("/me/mechanic-resolution-cases/:caseId/messages", authenticate, authorizeRoles("MECHANIC"), asyncHandler(addMyMechanicResolutionMessageHandler));
router.get("/me/mechanic-profile", authenticate, authorizeRoles("MECHANIC"), asyncHandler(getMyMechanicProfileHandler));
router.patch("/me/mechanic-profile", authenticate, authorizeRoles("MECHANIC"), asyncHandler(updateMyMechanicProfileHandler));
router.patch("/me/mechanic-service-coverage", authenticate, authorizeRoles("MECHANIC"), asyncHandler(updateMyMechanicServiceCoverageHandler));
router.post(
  "/me/mechanic-offers/:offerId/respond",
  authenticate,
  authorizeRoles("MECHANIC"),
  asyncHandler(respondMyMechanicOfferHandler)
);
router.post(
  "/me/mechanic-bookings/:bookingId/complete",
  authenticate,
  authorizeRoles("MECHANIC"),
  uploadBookingCompletionPhotos.array("photos", 8),
  asyncHandler(completeMyMechanicBookingHandler)
);
router.get("/confirm-email", asyncHandler(confirmEmailChangeHandler));

module.exports = router;
