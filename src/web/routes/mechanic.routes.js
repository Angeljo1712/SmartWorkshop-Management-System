const express = require("express");
const { uploadMechanicDocuments } = require("../../shared/middleware/upload");
const { env } = require("../../shared/config/env");
const mechanicService = require("../../features/mechanic/services/mechanic.service");

const router = express.Router();

router.get("/application", (_req, res) => {
  res.render("features/mechanic/application");
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
  res.render("features/mechanic/profile-picture", { mechanicId: req.params.id });
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

router.get("/mechanic/documents", async (req, res, next) => {
  try {
    const uploadStatus = req.query.upload === "success" ? "success" : req.query.upload === "error" ? "error" : null;
    const uploadMessage = typeof req.query.message === "string" ? req.query.message : null;
    const mechanicEmail = typeof req.query.email === "string" ? req.query.email.trim().toLowerCase() : "";
    const onboarding = mechanicEmail ? await mechanicService.getOnboardingByEmail(mechanicEmail) : null;
    res.render("features/mechanic/onboarding-documents", {
      mechanicId: null,
      uploadStatus,
      uploadMessage,
      mechanicEmail,
      mechanicInfoRequest: onboarding?.application_status === "info_requested" ? onboarding : null
    });
  } catch (error) {
    next(error);
  }
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
  if (!Number.isFinite(mechanicId)) {
    return next(new Error("Invalid mechanic id"));
  }

  // The welcome screen is informational and does not require a full profile lookup.
  // Rendering it directly avoids a hard failure if the profile query is temporarily unavailable.
  return res.render("features/mechanic/onboarding-complete", {
    mechanicId,
    profile: null
  });
});

router.post("/mechanic/set-password", (req, res, next) => {
  const { email, password, confirm, challenge_token, code } = req.body || {};

  if (code && challenge_token) {
    mechanicService
      .confirmPasswordSetupByEmail({ email, challengeToken: challenge_token, code })
      .then(() => res.json({ message: "Password updated." }))
      .catch(next);
    return;
  }

  mechanicService
    .startPasswordSetupByEmail({ email, password, confirm })
    .then(({ challengeToken }) =>
      res.json({
        message: "Verification code sent.",
        challenge_token: challengeToken,
        requires_code: true
      })
    )
    .catch(next);
});

router.get("/mechanic/:id/types", (req, res) => {
  res.render("features/mechanic/service-coverage", { mechanicId: req.params.id });
});

router.get("/mechanic/:id", async (req, res, next) => {
  try {
    const mechanicId = Number(req.params.id);
    const profile = await mechanicService.getProfile(mechanicId);
    res.render("features/mechanic/public-profile", { mechanicId: req.params.id, profile });
  } catch (err) {
    next(err);
  }
});

router.get("/application/join", (_req, res) => {
  res.render("features/application/join");
});

router.post("/application/join", (req, res, next) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  mechanicService
    .saveApplication(req.body)
    .then(() => {
      const target = email
        ? `/mechanic/documents?email=${encodeURIComponent(email)}`
        : "/mechanic/documents";
      res.redirect(302, target);
    })
    .catch(next);
});

module.exports = router;
