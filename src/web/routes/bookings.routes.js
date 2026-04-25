const express = require("express");

const router = express.Router();

router.get("/shop", (_req, res) => {
  res.redirect(301, "/bookings/vehicle");
});

router.get("/bookings/vehicle", (_req, res) => {
  res.render("features/bookings/vehicle");
});

router.get("/bookings", (_req, res) => {
  res.render("features/bookings/start");
});

const renderBookingsWork = (req, res) => {
  const { type } = req.query;
  if (type) {
    return res.render("features/bookings/work", { type: String(type) });
  }
  return res.render("features/bookings/start");
};

router.get("/bookings/work", renderBookingsWork);
router.get("/bookings/work/", renderBookingsWork);

router.get("/bookings/work/type", (_req, res) => {
  res.redirect(302, "/bookings/work?type=repair");
});

router.get("/bookings/details", (_req, res) => {
  res.render("features/bookings/details");
});

router.get("/bookings/payment", (_req, res) => {
  res.render("features/bookings/payment");
});

router.get("/bookings/confirm", (_req, res) => {
  res.render("features/bookings/confirm");
});

module.exports = router;
