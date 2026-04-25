const express = require("express");
const homeRoutes = require("./home.routes");
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const userRoutes = require("./user.routes");
const bookingsRoutes = require("./bookings.routes");
const mechanicRoutes = require("./mechanic.routes");

const router = express.Router();

router.use(homeRoutes);
router.use(authRoutes);
router.use(adminRoutes);
router.use(userRoutes);
router.use(bookingsRoutes);
router.use(mechanicRoutes);

module.exports = router;
