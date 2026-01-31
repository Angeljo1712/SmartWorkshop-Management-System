const { pool } = require("../config/pool");
const { AppError } = require("../../frontend/src/utils/appError");

const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

const resolvePostcode = async (postcode) => {
  if (!postcode || !postcodeRegex.test(postcode)) {
    throw new AppError("VALIDATION_ERROR", "postcode is invalid", 400);
  }
  const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload?.result) {
    throw new AppError("POSTCODE_NOT_FOUND", "postcode not found", 404);
  }
  return {
    latitude: payload.result.latitude,
    longitude: payload.result.longitude
  };
};

const findNearbyWorkshops = async ({ postcode, radiusKm = 10 }) => {
  const radius = Number(radiusKm);
  if (!Number.isFinite(radius) || radius <= 0) {
    throw new AppError("VALIDATION_ERROR", "radiusKm must be a positive number", 400);
  }

  const { latitude, longitude } = await resolvePostcode(postcode);
  const radiusMeters = radius * 1000;

  const [rows] = await pool.query(
    `SELECT
       workshop_id AS id,
       name,
       postcode,
       ST_Distance_Sphere(location, POINT(?, ?)) AS distanceMeters
     FROM workshops
     WHERE location IS NOT NULL
       AND ST_Distance_Sphere(location, POINT(?, ?)) <= ?
     ORDER BY distanceMeters ASC
     LIMIT 20`,
    [longitude, latitude, longitude, latitude, radiusMeters]
  );

  return { latitude, longitude, radiusKm: radius, results: rows };
};

module.exports = { findNearbyWorkshops };
