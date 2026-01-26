const express = require("express");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { asyncHandler } = require("../frontend/src/utils/asyncHandler");
const {
  listWorkshopsHandler,
  createWorkshopHandler,
  updateWorkshopHandler,
  deleteWorkshopHandler,
  listUsersHandler
} = require("../controllers/adminController");

const router = express.Router();

router.get("/workshops", authenticate, authorizeRoles("ADMIN"), asyncHandler(listWorkshopsHandler));
router.post("/workshops", authenticate, authorizeRoles("ADMIN"), asyncHandler(createWorkshopHandler));
router.patch("/workshops/:workshopId", authenticate, authorizeRoles("ADMIN"), asyncHandler(updateWorkshopHandler));
router.delete("/workshops/:workshopId", authenticate, authorizeRoles("ADMIN"), asyncHandler(deleteWorkshopHandler));
router.get("/users", authenticate, authorizeRoles("ADMIN"), asyncHandler(listUsersHandler));

module.exports = router;


