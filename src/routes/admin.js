const express = require("express");
const { authenticate, authorizeRoles } = require("../middlewares/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  listWorkshopsHandler,
  createWorkshopHandler,
  updateWorkshopHandler,
  deleteWorkshopHandler,
  listUsersHandler,
  listApplicationsHandler,
  updateApplicationStatusHandler,
  listBookingsHandler,
  updateBookingStatusHandler,
  listResolutionCasesHandler,
  updateResolutionCaseStatusHandler,
  getDashboardSummaryHandler,
  listPaymentsHandler,
  updatePaymentStatusHandler,
  updateCatalogServiceOrderHandler,
  createUserHandler,
  setUserRoleHandler,
  setUserStatusHandler,
  updateUserHandler,
  deleteUserHandler
} = require("../controllers/adminController");

const router = express.Router();

router.get("/workshops", authenticate, authorizeRoles("ADMIN"), asyncHandler(listWorkshopsHandler));
router.post("/workshops", authenticate, authorizeRoles("ADMIN"), asyncHandler(createWorkshopHandler));
router.patch("/workshops/:workshopId", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateWorkshopHandler));
router.delete("/workshops/:workshopId", authenticate, authorizeRoles("ADMIN"), asyncHandler(deleteWorkshopHandler));
router.get("/users", authenticate, authorizeRoles("ADMIN"), asyncHandler(listUsersHandler));
router.get("/dashboard-summary", authenticate, authorizeRoles("ADMIN"), asyncHandler(getDashboardSummaryHandler));
router.get("/applications", authenticate, authorizeRoles("ADMIN"), asyncHandler(listApplicationsHandler));
router.patch("/applications/:userId/status", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateApplicationStatusHandler));
router.get("/bookings", authenticate, authorizeRoles("ADMIN"), asyncHandler(listBookingsHandler));
router.patch("/bookings/:bookingId/status", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateBookingStatusHandler));
router.get("/resolution-cases", authenticate, authorizeRoles("ADMIN"), asyncHandler(listResolutionCasesHandler));
router.patch("/resolution-cases/:caseId/status", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateResolutionCaseStatusHandler));
router.get("/payments", authenticate, authorizeRoles("ADMIN"), asyncHandler(listPaymentsHandler));
router.patch("/payments/:recordId/status", authenticate, authorizeRoles("ADMIN"), asyncHandler(updatePaymentStatusHandler));
router.patch("/catalog/:serviceId/order", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateCatalogServiceOrderHandler));
router.post("/users", authenticate, authorizeRoles("ADMIN"), asyncHandler(createUserHandler));
router.patch("/users/:userId/roles", authenticate, authorizeRoles("ADMIN"), asyncHandler(setUserRoleHandler));
router.patch("/users/:userId/status", authenticate, authorizeRoles("ADMIN"), asyncHandler(setUserStatusHandler));
router.patch("/users/:userId", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateUserHandler));
router.delete("/users/:userId", authenticate, authorizeRoles("ADMIN"), asyncHandler(deleteUserHandler));

module.exports = router;



