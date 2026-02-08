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
const bookingsRouter = require("./routes/bookings");
const catalogRouter = require("./routes/catalog");
const { errorHandler } = require("./middlewares/error");
const { cors } = require("./middlewares/cors");
const mechanicService = require("./services/mechanicService");

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

app.get("/user", (_req, res) => {
  res.redirect(302, "/user/dashboard");
});

app.get("/user/dashboard", (req, res) => {
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

const renderBookingsWork = (req, res) => {
  const { type } = req.query;
  if (type) {
    return res.render("pages/bookings/work", { type: String(type) });
  }
  return res.render("pages/bookings/index");
};

app.get("/bookings/work", renderBookingsWork);
app.get("/bookings/work/", renderBookingsWork);

app.get("/bookings/work/type", (req, res) => {
  res.redirect(302, "/bookings/work?type=repair");
});

app.get("/bookings/details", (req, res) => {
  res.render("pages/bookings/details");
});

app.get("/bookings/payment", (req, res) => {
  res.render("pages/bookings/payment");
});

app.get("/bookings/confirm", (req, res) => {
  res.render("pages/bookings/confirm");
});

app.get("/mechanic/home", (req, res) => {
  res.render("pages/mechanic/home");
});

app.get("/mechanic", (req, res) => {
  res.redirect(302, "/mechanic/dashboard");
});

app.get("/mechanic/dashboard", (req, res) => {
  res.render("pages/mechanic/dashboard");
});

app.get("/mechanic/:id/profile", (req, res) => {
  res.render("pages/mechanic/profile", { mechanicId: req.params.id });
});

app.get("/mechanic/:id/picture", (req, res) => {
  res.render("pages/mechanic/picture", { mechanicId: req.params.id });
});

app.get("/mechanic/:id/certifications", (req, res) => {
  mechanicService
    .getProfile(Number(req.params.id))
    .then((profile) => res.render("pages/mechanic/certifications", { mechanicId: req.params.id, profile }))
    .catch((err) => {
      console.error(err);
      res.render("pages/mechanic/certifications", { mechanicId: req.params.id, profile: null });
    });
});

app.post("/mechanic/:id/certifications", (req, res, next) => {
  const mechanicId = Number(req.params.id);
  const { qualification } = req.body || {};
  mechanicService
    .addQualification({ userId: mechanicId, name: qualification })
    .then(() => res.redirect(302, `/mechanic/${mechanicId}/certifications`))
    .catch(next);
});

app.get("/mechanic/:id/tax", (req, res) => {
  res.render("pages/mechanic/tax", { mechanicId: req.params.id });
});

app.get("/mechanic/:id/preferences", (req, res) => {
  res.render("pages/mechanic/preferences", { mechanicId: req.params.id });
});

app.get("/mechanic/documents", (req, res) => {
  res.render("pages/mechanic/documents", { mechanicId: null });
});

app.get("/mechanic/:id/types", (req, res) => {
  res.render("pages/mechanic/types", { mechanicId: req.params.id });
});

app.get("/mechanic/:id", async (req, res, next) => {
  try {
    const mechanicId = Number(req.params.id);
    const profile = await mechanicService.getProfile(mechanicId);
    res.render("pages/mechanic/view", { mechanicId: req.params.id, profile });
  } catch (err) {
    next(err);
  }
});

app.get("/application/join", (req, res) => {
  res.render("pages/application/join");
});

app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/service-requests", serviceRequestRouter);
app.use("/api/quotations", quotationRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users", usersRouter);
app.use("/api/vehicle-enquiry", vehicleEnquiryRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/catalog", catalogRouter);
app.use("/workshops", workshopsRouter);

app.use(errorHandler);

module.exports = app;

