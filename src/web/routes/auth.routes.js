const express = require("express");

const router = express.Router();

router.get("/sign-in", (_req, res) => {
  res.render("features/auth/login");
});

router.get("/auth", (_req, res) => {
  res.render("features/auth/landing");
});

router.get("/auth/login", (_req, res) => {
  res.render("features/auth/login");
});

router.get("/auth/select-role", (_req, res) => {
  res.render("features/auth/select-role");
});

router.get("/auth/forgot-password", (_req, res) => {
  res.render("features/auth/forgot-password");
});

router.get("/auth/reset-password", (_req, res) => {
  res.render("features/auth/reset-password");
});

router.get("/auth/confirm-email", (_req, res) => {
  res.render("features/auth/confirm-email");
});

module.exports = router;
