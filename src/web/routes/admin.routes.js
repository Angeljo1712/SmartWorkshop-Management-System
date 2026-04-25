const express = require("express");

const router = express.Router();

router.get("/admin", (_req, res) => {
  res.render("features/admin/dashboard");
});

router.get("/admin/dashboard", (_req, res) => {
  res.render("features/admin/dashboard");
});

module.exports = router;
