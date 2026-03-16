const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  saveBookingDetailsHandler,
  getDraftHandler,
  addDraftItemHandler,
  removeDraftItemHandler,
  payDraftHandler,
  setDraftAccountPasswordHandler
} = require("../controllers/bookingsController");

const router = express.Router();

router.post("/details", asyncHandler(saveBookingDetailsHandler));
router.get("/draft", asyncHandler(getDraftHandler));
router.post("/draft/items", asyncHandler(addDraftItemHandler));
router.delete("/draft/items/:serviceId", asyncHandler(removeDraftItemHandler));
router.post("/draft/pay", asyncHandler(payDraftHandler));
router.post("/draft/account-password", asyncHandler(setDraftAccountPasswordHandler));

module.exports = router;
