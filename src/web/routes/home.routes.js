const express = require("express");
const { pool } = require("../../shared/config/pool");
const { createContactMessage } = require("../../features/contact/services/contact.service");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contactStatus = req.query.contact === "sent" ? "sent" : null;
  const contactError = req.query.contact === "error" ? "error" : null;

  try {
    const [reviewRows] = await pool.query(
      `SELECT
          r.rating,
          r.comment,
          r.created_at,
          up.name,
          up.lastname,
          up.avatar_url,
          v.make,
          v.model,
          v.year
       FROM reviews r
       INNER JOIN bookings b ON b.id = r.booking_id
       LEFT JOIN user_profiles up ON up.user_id = r.customer_id
       LEFT JOIN vehicles v ON v.id = b.vehicle_id
       WHERE TRIM(COALESCE(r.comment, '')) <> ''
       ORDER BY RAND()
       LIMIT 3`
    );

    const homeReviews = reviewRows.map((row) => {
      const customerName = [row.name, row.lastname].filter(Boolean).join(" ").trim() || "Verified customer";
      const vehicleLabel = [row.make, row.model]
        .filter((value) => String(value || "").trim())
        .join(" ")
        .trim();

      const initials = customerName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("") || "SW";

      return {
        customerName,
        vehicleLabel: vehicleLabel || "Verified booking",
        comment: row.comment,
        avatarUrl: row.avatar_url || "",
        initials,
        rating: Number(row.rating || 0),
        year: row.year || null
      };
    });

    res.render("features/home/home", {
      contactStatus,
      contactError,
      homeReviews
    });
  } catch (error) {
    next(error);
  }
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

module.exports = router;
