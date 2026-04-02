const express = require("express");
const { uploadMechanicDocuments } = require("../../shared/middleware/upload");
const { env } = require("../../shared/config/env");
const mechanicService = require("../../features/mechanic/services/mechanic.service");
const { createContactMessage } = require("../../features/contact/services/contact.service");

const router = express.Router();

router.get("/", (req, res) => {
  const contactStatus = req.query.contact === "sent" ? "sent" : null;
  const contactError = req.query.contact === "error" ? "error" : null;
  res.render("features/home/home", { contactStatus, contactError });
});

router.post("/contact", (req, res, next) => {
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

router.get("/sign-in", (_req, res) => {
  res.render("features/auth/login");
});

router.get("/auth", (_req, res) => {
  res.render("features/auth/index");
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

router.get("/admin", (_req, res) => {
  res.render("features/admin/dashboard");
});

router.get("/admin/dashboard", (_req, res) => {
  res.render("features/admin/dashboard");
});

router.get("/user", (_req, res) => {
  res.redirect(302, "/user/dashboard");
});

router.get("/user/dashboard", (_req, res) => {
  res.render("features/user/index");
});

router.get("/profile", (_req, res) => {
  res.render("features/user/index");
});

router.get("/shop", (_req, res) => {
  res.redirect(301, "/bookings/vehicle");
});

router.get("/bookings/vehicle", (_req, res) => {
  res.render("features/bookings/vehicle");
});

router.get("/bookings", (_req, res) => {
  res.render("features/bookings/index");
});

const renderBookingsWork = (req, res) => {
  const { type } = req.query;
  if (type) {
    return res.render("features/bookings/work", { type: String(type) });
  }
  return res.render("features/bookings/index");
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

router.get("/application", (_req, res) => {
  res.render("features/mechanic/home");
});

router.get("/mechanic/home", (_req, res) => {
  res.redirect("/application");
});

router.get("/mechanic", (_req, res) => {
  res.redirect(302, "/mechanic/dashboard");
});

router.get("/mechanic/dashboard", (_req, res) => {
  res.render("features/mechanic/dashboard", {
    geoapify: {
      apiKey: env.geoapify.apiKey || "",
      mapStyle: env.geoapify.mapStyle || "osm-carto"
    }
  });
});

router.get("/mechanic/:id/profile", (req, res) => {
  mechanicService
    .getProfile(Number(req.params.id))
    .then((profile) => res.render("features/mechanic/profile", { mechanicId: req.params.id, profile }))
    .catch((err) => {
      console.error(err);
      res.render("features/mechanic/profile", { mechanicId: req.params.id, profile: null });
    });
});

router.post("/mechanic/:id/profile", (req, res, next) => {
  const mechanicId = Number(req.params.id);
  const { years_experience, work_history, memberships } = req.body || {};
  mechanicService
    .updateProfile({ userId: mechanicId, years_experience, work_history, memberships })
    .then(() => res.redirect(302, `/mechanic/${mechanicId}/profile`))
    .catch(next);
});

router.get("/mechanic/:id/picture", (req, res) => {
  res.render("features/mechanic/picture", { mechanicId: req.params.id });
});

router.get("/mechanic/:id/certifications", (req, res) => {
  mechanicService
    .getProfile(Number(req.params.id))
    .then((profile) => res.render("features/mechanic/certifications", { mechanicId: req.params.id, profile }))
    .catch((err) => {
      console.error(err);
      res.render("features/mechanic/certifications", { mechanicId: req.params.id, profile: null });
    });
});

router.post("/mechanic/:id/certifications", (req, res, next) => {
  const mechanicId = Number(req.params.id);
  const { qualification } = req.body || {};
  mechanicService
    .addQualification({ userId: mechanicId, name: qualification })
    .then(() => res.redirect(302, `/mechanic/${mechanicId}/certifications`))
    .catch(next);
});

router.get("/mechanic/:id/tax", (req, res) => {
  res.render("features/mechanic/tax", { mechanicId: req.params.id });
});

router.get("/mechanic/:id/preferences", (req, res) => {
  res.render("features/mechanic/preferences", { mechanicId: req.params.id });
});

router.get("/mechanic/documents", (req, res) => {
  const uploadStatus = req.query.upload === "success" ? "success" : req.query.upload === "error" ? "error" : null;
  const uploadMessage = typeof req.query.message === "string" ? req.query.message : null;
  res.render("features/mechanic/documents", { mechanicId: null, uploadStatus, uploadMessage });
});

router.post("/mechanic/documents/upload", uploadMechanicDocuments.array("documents", 10), (req, res) => {
  const { email } = req.body || {};
  mechanicService
    .saveUploadedDocumentsByEmail({ email, files: req.files || [] })
    .then(() => res.redirect(302, "/mechanic/documents?upload=success"))
    .catch((err) => {
      const message = encodeURIComponent(err?.message || "Upload failed");
      res.redirect(302, `/mechanic/documents?upload=error&message=${message}`);
    });
});

router.post("/mechanic/documents/complete", (req, res, next) => {
  const { email } = req.body || {};
  mechanicService
    .completeApplication({ email })
    .then(({ userId }) => res.redirect(302, `/mechanic/welcome/${userId}`))
    .catch(next);
});

router.get("/mechanic/welcome/:id", (req, res, next) => {
  const mechanicId = Number(req.params.id);
  mechanicService
    .getProfile(mechanicId)
    .then((profile) => res.render("features/mechanic/welcome", { profile }))
    .catch(next);
});

router.post("/mechanic/set-password", (req, res, next) => {
  const { email, password, confirm } = req.body || {};
  if (password !== confirm) {
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Passwords do not match." } });
  }
  mechanicService
    .setPasswordByEmail({ email, password })
    .then(() => res.json({ message: "Password updated." }))
    .catch(next);
});

router.get("/mechanic/:id/types", (req, res) => {
  res.render("features/mechanic/types", { mechanicId: req.params.id });
});

router.get("/mechanic/:id", async (req, res, next) => {
  try {
    const mechanicId = Number(req.params.id);
    const profile = await mechanicService.getProfile(mechanicId);
    res.render("features/mechanic/view", { mechanicId: req.params.id, profile });
  } catch (err) {
    next(err);
  }
});

router.get("/application/join", (_req, res) => {
  res.render("features/application/join");
});

router.post("/application/join", (req, res, next) => {
  mechanicService
    .saveApplication(req.body)
    .then(() => res.redirect(302, "/mechanic/documents"))
    .catch(next);
});

module.exports = router;
