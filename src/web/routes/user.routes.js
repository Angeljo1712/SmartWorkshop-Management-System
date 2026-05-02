const express = require("express");

const router = express.Router();

router.get("/user", (_req, res) => {
  res.redirect(302, "/user/dashboard");
});

router.get("/user/dashboard", (_req, res) => {
  res.render("features/user/dashboard");
});

router.get("/profile", (_req, res) => {
  res.render("features/user/dashboard");
});

module.exports = router;
