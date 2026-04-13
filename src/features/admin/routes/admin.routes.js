const express = require("express");
const { authenticate, authorizeRoles } = require("../../../shared/middleware/auth");
const { asyncHandler } = require("../../../shared/utils/asyncHandler");
const {
  listWorkshopsHandler,
  createWorkshopHandler,
  updateWorkshopHandler,
  deleteWorkshopHandler,
  listUsersHandler,
  listApplicationsHandler,
  listApplicationDocumentsHandler,
  updateApplicationStatusHandler,
  listBookingsHandler,
  updateBookingStatusHandler,
  listResolutionCasesHandler,
  getResolutionCaseHandler,
  addResolutionCaseMessageHandler,
  listContactMessagesHandler,
  updateContactMessageStatusHandler,
  updateResolutionCaseStatusHandler,
  getDashboardSummaryHandler,
  listPaymentsHandler,
  getPaymentDetailHandler,
  addPaymentAdminNoteHandler,
  updatePaymentStatusHandler,
  createCatalogServiceHandler,
  updateCatalogServiceHandler,
  updateCatalogServiceOrderHandler,
  deleteCatalogServiceHandler,
  createUserHandler,
  setUserRoleHandler,
  setUserStatusHandler,
  updateUserHandler,
  deleteUserHandler
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/workshops", authenticate, authorizeRoles("ADMIN"), asyncHandler(listWorkshopsHandler));
router.post("/workshops", authenticate, authorizeRoles("ADMIN"), asyncHandler(createWorkshopHandler));
router.patch("/workshops/:workshopId", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateWorkshopHandler));
router.delete("/workshops/:workshopId", authenticate, authorizeRoles("ADMIN"), asyncHandler(deleteWorkshopHandler));
router.get("/users", authenticate, authorizeRoles("ADMIN"), asyncHandler(listUsersHandler));
router.get("/dashboard-summary", authenticate, authorizeRoles("ADMIN"), asyncHandler(getDashboardSummaryHandler));
router.get("/applications", authenticate, authorizeRoles("ADMIN"), asyncHandler(listApplicationsHandler));
router.get("/applications/:userId/documents", authenticate, authorizeRoles("ADMIN"), asyncHandler(listApplicationDocumentsHandler));
router.patch("/applications/:userId/status", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateApplicationStatusHandler));
router.get("/bookings", authenticate, authorizeRoles("ADMIN"), asyncHandler(listBookingsHandler));
router.patch("/bookings/:bookingId/status", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateBookingStatusHandler));
router.get("/resolution-cases", authenticate, authorizeRoles("ADMIN"), asyncHandler(listResolutionCasesHandler));
router.get("/resolution-cases/:caseId", authenticate, authorizeRoles("ADMIN"), asyncHandler(getResolutionCaseHandler));
router.post("/resolution-cases/:caseId/messages", authenticate, authorizeRoles("ADMIN"), asyncHandler(addResolutionCaseMessageHandler));
router.get("/contact-messages", authenticate, authorizeRoles("ADMIN"), asyncHandler(listContactMessagesHandler));
router.patch("/contact-messages/:messageId/status", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateContactMessageStatusHandler));
router.patch("/resolution-cases/:caseId/status", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateResolutionCaseStatusHandler));
router.get("/payments", authenticate, authorizeRoles("ADMIN"), asyncHandler(listPaymentsHandler));
router.get("/payments/:recordId/detail", authenticate, authorizeRoles("ADMIN"), asyncHandler(getPaymentDetailHandler));
router.post("/payments/:recordId/notes", authenticate, authorizeRoles("ADMIN"), asyncHandler(addPaymentAdminNoteHandler));
router.patch("/payments/:recordId/status", authenticate, authorizeRoles("ADMIN"), asyncHandler(updatePaymentStatusHandler));
router.post("/catalog", authenticate, authorizeRoles("ADMIN"), asyncHandler(createCatalogServiceHandler));
router.patch("/catalog/:serviceId", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateCatalogServiceHandler));
router.patch("/catalog/:serviceId/order", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateCatalogServiceOrderHandler));
router.delete("/catalog/:serviceId", authenticate, authorizeRoles("ADMIN"), asyncHandler(deleteCatalogServiceHandler));
router.post("/users", authenticate, authorizeRoles("ADMIN"), asyncHandler(createUserHandler));
router.patch("/users/:userId/roles", authenticate, authorizeRoles("ADMIN"), asyncHandler(setUserRoleHandler));
router.patch("/users/:userId/status", authenticate, authorizeRoles("ADMIN"), asyncHandler(setUserStatusHandler));
router.patch("/users/:userId", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateUserHandler));
router.delete("/users/:userId", authenticate, authorizeRoles("ADMIN"), asyncHandler(deleteUserHandler));

module.exports = router;



