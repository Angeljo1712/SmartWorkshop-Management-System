const path = require("path");
const express = require("express");
const healthRouter = require("./routes/health");
const authRouter = require("./routes/auth");
const serviceRequestRouter = require("./routes/serviceRequests");
const quotationRouter = require("./routes/quotations");
const jobRouter = require("./routes/jobs");
const adminRouter = require("./routes/admin");
const usersRouter = require("./routes/users");
const vehicleEnquiryRouter = require("./routes/vehicleEnquiry");
const workshopsRouter = require("./routes/workshops");
const { errorHandler } = require("./middlewares/error");
const { cors } = require("./middlewares/cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(express.static(path.join(__dirname, "..", "public")));
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("pages/home");
});

app.get("/sign-in", (req, res) => {
  res.render("pages/auth/login");
});

app.get("/auth", (req, res) => {
  res.render("pages/auth/index");
});

app.get("/auth/login", (req, res) => {
  res.render("pages/auth/login");
});

app.get("/auth/forgot-password", (req, res) => {
  res.render("pages/auth/forgot-password");
});

app.get("/auth/reset-password", (req, res) => {
  res.render("pages/auth/reset-password");
});

app.get("/auth/confirm-email", (req, res) => {
  res.render("pages/auth/confirm-email");
});

app.get("/admin", (req, res) => {
  res.render("pages/admin/dashboard");
});

app.get("/user", (req, res) => {
  res.render("pages/user/index");
});

app.get("/profile", (req, res) => {
  res.render("pages/user/profile");
});

app.get("/shop", (_req, res) => {
  res.redirect(301, "/bookings/work");
});

app.get("/bookings", (_req, res) => {
  res.redirect(301, "/bookings/work");
});

app.get("/bookings/work", (req, res) => {
  res.render("pages/bookings/index");
});

app.get("/mechanic/home", (req, res) => {
  res.render("pages/mechanic/home");
});

app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/service-requests", serviceRequestRouter);
app.use("/api/quotations", quotationRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users", usersRouter);
app.use("/api/vehicle-enquiry", vehicleEnquiryRouter);
app.use("/workshops", workshopsRouter);

app.use(errorHandler);

module.exports = app;

