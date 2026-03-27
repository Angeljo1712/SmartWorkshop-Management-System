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
const contactRouter = require("./routes/contact");
const { errorHandler } = require("./middlewares/error");
const { cors } = require("./middlewares/cors");
const { uploadMechanicDocuments } = require("./middlewares/upload");
const { env } = require("./config/env");
const mechanicService = require("./services/mechanicService");
const { createContactMessage } = require("./services/contactService");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(express.static(path.join(__dirname, "..", "public")));
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  const contactStatus = req.query.contact === "sent" ? "sent" : null;
  const contactError = req.query.contact === "error" ? "error" : null;
  res.render("pages/home", { contactStatus, contactError });
});

app.post("/contact", (req, res, next) => {
  const { name, email, subject, message } = req.body || {};
  const forwarded = req.headers["x-forwarded-for"];
  const ipAddress =
    typeof forwarded === "string" && forwarded.length
      ? forwarded.split(",")[0].trim()
      : req.ip || req.socket?.remoteAddress || null;

  createContactMessage({
    name,
    email,
    subject,
    message,
    source: "home_web",
    ipAddress,
    userAgent: req.headers["user-agent"] || null
  })
    .then(() => res.redirect(302, "/?contact=sent#contact"))
    .catch((err) => {
      if (err?.code === "VALIDATION_ERROR") {
        return res.redirect(302, "/?contact=error#contact");
      }
      return next(err);
    });
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

app.get("/auth/select-role", (req, res) => {
  res.render("pages/auth/select-role");
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

app.get("/admin/dashboard", (req, res) => {
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
  res.redirect(301, "/bookings/vehicle");
});

app.get("/bookings/vehicle", (_req, res) => {
  res.render("pages/bookings/vehicle");
});

app.get("/bookings", (_req, res) => {
  res.render("pages/bookings/index");
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

app.get("/application", (req, res) => {
  res.render("pages/mechanic/home");
});

app.get("/mechanic/home", (_req, res) => {
  res.redirect("/application");
});

app.get("/mechanic", (req, res) => {
  res.redirect(302, "/mechanic/dashboard");
});

app.get("/mechanic/dashboard", (req, res) => {
  res.render("pages/mechanic/dashboard", {
    geoapify: {
      apiKey: env.geoapify.apiKey || "",
      mapStyle: env.geoapify.mapStyle || "osm-carto"
    }
  });
});

app.get("/mechanic/:id/profile", (req, res) => {
  mechanicService
    .getProfile(Number(req.params.id))
    .then((profile) => res.render("pages/mechanic/profile", { mechanicId: req.params.id, profile }))
    .catch((err) => {
      console.error(err);
      res.render("pages/mechanic/profile", { mechanicId: req.params.id, profile: null });
    });
});

app.post("/mechanic/:id/profile", (req, res, next) => {
  const mechanicId = Number(req.params.id);
  const { years_experience, work_history, memberships } = req.body || {};
  mechanicService
    .updateProfile({ userId: mechanicId, years_experience, work_history, memberships })
    .then(() => res.redirect(302, `/mechanic/${mechanicId}/profile`))
    .catch(next);
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
  const uploadStatus = req.query.upload === "success" ? "success" : req.query.upload === "error" ? "error" : null;
  const uploadMessage = typeof req.query.message === "string" ? req.query.message : null;
  res.render("pages/mechanic/documents", { mechanicId: null, uploadStatus, uploadMessage });
});

app.post("/mechanic/documents/upload", uploadMechanicDocuments.array("documents", 10), (req, res, next) => {
  const { email } = req.body || {};
  mechanicService
    .saveUploadedDocumentsByEmail({ email, files: req.files || [] })
    .then(() => res.redirect(302, "/mechanic/documents?upload=success"))
    .catch((err) => {
      const message = encodeURIComponent(err?.message || "Upload failed");
      res.redirect(302, `/mechanic/documents?upload=error&message=${message}`);
    });
});

app.post("/mechanic/documents/complete", (req, res, next) => {
  const { email } = req.body || {};
  mechanicService
    .completeApplication({ email })
    .then(({ userId }) => res.redirect(302, `/mechanic/welcome/${userId}`))
    .catch(next);
});

app.get("/mechanic/welcome/:id", (req, res, next) => {
  const mechanicId = Number(req.params.id);
  mechanicService
    .getProfile(mechanicId)
    .then((profile) => res.render("pages/mechanic/welcome", { profile }))
    .catch(next);
});

app.post("/mechanic/set-password", (req, res, next) => {
  const { email, password, confirm } = req.body || {};
  if (password !== confirm) {
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Passwords do not match." } });
  }
  mechanicService
    .setPasswordByEmail({ email, password })
    .then(() => res.json({ message: "Password updated." }))
    .catch(next);
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

app.post("/application/join", (req, res, next) => {
  mechanicService
    .saveApplication(req.body)
    .then(() => res.redirect(302, "/mechanic/documents"))
    .catch(next);
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
app.use("/api/contact", contactRouter);
app.use("/workshops", workshopsRouter);

app.use(errorHandler);

module.exports = app;

