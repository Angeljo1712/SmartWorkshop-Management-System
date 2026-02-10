const express = require("express");
const { authenticate, authorizeRoles } = require("../middlewares/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  listWorkshopsHandler,
  createWorkshopHandler,
  updateWorkshopHandler,
  deleteWorkshopHandler,
  listUsersHandler,
  createUserHandler,
  setUserRoleHandler,
  setUserStatusHandler
} = require("../controllers/adminController");

const router = express.Router();

router.get("/workshops", authenticate, authorizeRoles("ADMIN"), asyncHandler(listWorkshopsHandler));
router.post("/workshops", authenticate, authorizeRoles("ADMIN"), asyncHandler(createWorkshopHandler));
router.patch("/workshops/:workshopId", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateWorkshopHandler));
router.delete("/workshops/:workshopId", authenticate, authorizeRoles("ADMIN"), asyncHandler(deleteWorkshopHandler));
router.get("/users", authenticate, authorizeRoles("ADMIN"), asyncHandler(listUsersHandler));
router.post("/users", authenticate, authorizeRoles("ADMIN"), asyncHandler(createUserHandler));
router.patch("/users/:userId/roles", authenticate, authorizeRoles("ADMIN"), asyncHandler(setUserRoleHandler));
router.patch("/users/:userId/status", authenticate, authorizeRoles("ADMIN"), asyncHandler(setUserStatusHandler));

module.exports = router;



