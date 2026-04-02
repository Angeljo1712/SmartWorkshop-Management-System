const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { pool } = require("../../../shared/config/pool");
const { AppError } = require("../../../shared/utils/appError");

const normalizeName = (value) => String(value || "").trim();

const geocodePostcode = async (postcode) => {
  const encoded = encodeURIComponent(postcode);
  const url = `https://api.postcodes.io/postcodes/${encoded}`;
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) return null;
    const payload = await response.json();
    if (!payload?.result) return null;
    const { longitude, latitude } = payload.result;
    if (typeof longitude !== "number" || typeof latitude !== "number") return null;
    return { longitude, latitude };
  } catch (_err) {
    return null;
  }
};

const saveBookingDetails = async (payload) => {
  const firstName = normalizeName(payload.first_name);
  const lastName = normalizeName(payload.last_name);
  const email = normalizeName(payload.email).toLowerCase();
  const phone = normalizeName(payload.phone);
  const address1 = normalizeName(payload.address1);
  const address2 = normalizeName(payload.address2);
  const city = normalizeName(payload.city);
  const postcode = normalizeName(payload.postcode);
  const notes = normalizeName(payload.notes);
  const vehicleDrivable = String(payload.vehicle_drivable || "").toLowerCase() === "yes" ? "yes" : "no";
  const sessionId = String(payload.session_id || "").trim();
  const availability = payload.availability || null;
  const vehicle = payload.vehicle || null;

  if (!firstName || !lastName || !email || !phone || !address1 || !city || !postcode || !sessionId) {
    throw new AppError(
      "VALIDATION_ERROR",
      "first_name, last_name, email, phone, address1, city, postcode, session_id are required",
      400
    );
  }

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  let userId = null;
  let createdAccount = false;

  if (existing[0]) {
    userId = existing[0].id;
    await pool.query("UPDATE users SET phone = ? WHERE id = ?", [phone, userId]);
    await pool.query(
      `INSERT INTO user_profiles (user_id, name, lastname)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), lastname = VALUES(lastname)`,
      [userId, firstName, lastName]
    );
    await pool.query(
      "INSERT INTO user_roles (user_id, role) VALUES (?, ?) ON DUPLICATE KEY UPDATE role = role",
      [userId, "user"]
    );
  } else {
    const passwordHash = await bcrypt.hash(crypto.randomBytes(18).toString("hex"), 10);
    const username = String(email || "").trim().toLowerCase();
    const [result] = await pool.query(
      "INSERT INTO users (uuid_public, email, username, password_hash, role, status, phone) VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?, ?)",
      [email, username, passwordHash, "user", "active", phone]
    );
    userId = result.insertId;
    createdAccount = true;
    await pool.query("INSERT INTO user_profiles (user_id, name, lastname) VALUES (?, ?, ?)", [
      userId,
      firstName,
      lastName
    ]);
    await pool.query("INSERT INTO user_roles (user_id, role) VALUES (?, ?)", [userId, "user"]);
  }

  const geo = await geocodePostcode(postcode);
  const pointWkt = geo ? `POINT(${geo.longitude} ${geo.latitude})` : "POINT(0 0)";

  await pool.query(
    `INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
     VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?, ?, ?, ST_GeomFromText(?, 4326))`,
    [userId, "Primary", address1, address2 || null, city, postcode, "GB", pointWkt]
  );

  await pool.query(
    `INSERT INTO booking_drafts (session_id, user_id, notes, vehicle_drivable, availability_json, vehicle_json)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       user_id = VALUES(user_id),
       notes = VALUES(notes),
       vehicle_drivable = VALUES(vehicle_drivable),
       availability_json = VALUES(availability_json),
       vehicle_json = VALUES(vehicle_json)`,
    [
      sessionId,
      userId,
      notes || null,
      vehicleDrivable,
      availability ? JSON.stringify(availability) : null,
      vehicle ? JSON.stringify(vehicle) : null
    ]
  );

  return { customerId: userId, createdAccount };
};

const ensureDraft = async (sessionId) => {
  if (!sessionId) {
    throw new AppError("VALIDATION_ERROR", "session_id is required", 400);
  }
  const [existing] = await pool.query("SELECT id FROM booking_drafts WHERE session_id = ?", [sessionId]);
  if (existing[0]) return existing[0].id;
  const [result] = await pool.query("INSERT INTO booking_drafts (session_id) VALUES (?)", [sessionId]);
  return result.insertId;
};

const getDraft = async (sessionId) => {
  if (!sessionId) {
    throw new AppError("VALIDATION_ERROR", "session_id is required", 400);
  }
  const [draftRows] = await pool.query(
    `SELECT id, session_id, user_id, updated_at, notes, vehicle_drivable, availability_json
     FROM booking_drafts
     WHERE session_id = ?`,
    [sessionId]
  );
  if (!draftRows[0]) {
    return { items: [], subtotal: 0, vat: 0, total: 0 };
  }
  const draftId = draftRows[0].id;
  const [itemRows] = await pool.query(
    `SELECT bdi.service_id, bdi.qty, bdi.line_total_eur,
            sc.name, sc.description, sc.base_labour_minutes
     FROM booking_draft_items bdi
     JOIN service_catalog sc ON sc.id = bdi.service_id
     WHERE bdi.draft_id = ?
     ORDER BY sc.name ASC`,
    [draftId]
  );
  const subtotal = itemRows.reduce((sum, item) => sum + Number(item.line_total_eur), 0);
  const vat = subtotal * 0.2;
  const total = subtotal + vat;
  let user = null;
  let address = null;
  if (draftRows[0]?.user_id) {
    const [userRows] = await pool.query(
      `SELECT u.id, u.email, u.phone, BIN_TO_UUID(u.uuid_public) AS uuid_public,
              p.name, p.lastname, p.avatar_url
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.id = ?`,
      [draftRows[0].user_id]
    );
    user = userRows[0] || null;
    const [addrRows] = await pool.query(
      `SELECT line1, line2, city, postal_code, country
       FROM addresses
       WHERE user_id = ?
       ORDER BY id DESC
       LIMIT 1`,
      [draftRows[0].user_id]
    );
    address = addrRows[0] || null;
  }

  let availability = [];
  const rawAvailability = draftRows[0]?.availability_json;
  if (rawAvailability) {
    if (typeof rawAvailability === "string") {
      try {
        availability = JSON.parse(rawAvailability);
      } catch (_err) {
        availability = [];
      }
    } else {
      availability = rawAvailability;
    }
  }

  return {
    items: itemRows,
    subtotal,
    vat,
    total,
    notes: draftRows[0]?.notes || "",
    vehicle_drivable: draftRows[0]?.vehicle_drivable || null,
    availability,
    user,
    address
  };
};

const addDraftItem = async ({ session_id, service_id }) => {
  if (!session_id || !service_id) {
    throw new AppError("VALIDATION_ERROR", "session_id and service_id are required", 400);
  }

  const draftId = await ensureDraft(session_id);
  const [serviceRows] = await pool.query(
    `SELECT sc.id, sp.labour_rate_eur AS price
     FROM service_catalog sc
     LEFT JOIN service_pricing sp ON sp.service_id = sc.id AND sp.region = 'UK-default'
     WHERE sc.id = ?`,
    [service_id]
  );
  const service = serviceRows[0];
  if (!service) {
    throw new AppError("NOT_FOUND", "Service not found", 404);
  }
  const unitPrice = Number(service.price || 0);

  await pool.query(
    `INSERT INTO booking_draft_items (draft_id, service_id, qty, line_total_eur)
     VALUES (?, ?, 1, ?)
     ON DUPLICATE KEY UPDATE
       qty = qty + 1,
       line_total_eur = (qty + 1) * ?`,
    [draftId, service.id, unitPrice, unitPrice]
  );

  return getDraft(session_id);
};

const removeDraftItem = async ({ sessionId, serviceId }) => {
  if (!sessionId || !serviceId) {
    throw new AppError("VALIDATION_ERROR", "session_id and service_id are required", 400);
  }
  const [draftRows] = await pool.query("SELECT id FROM booking_drafts WHERE session_id = ?", [sessionId]);
  if (!draftRows[0]) {
    return { items: [], subtotal: 0, vat: 0, total: 0 };
  }
  await pool.query(
    "DELETE FROM booking_draft_items WHERE draft_id = ? AND service_id = ?",
    [draftRows[0].id, serviceId]
  );
  return getDraft(sessionId);
};

const payDraft = async ({ session_id, provider = "mock", currency = "GBP" }) => {
  if (!session_id) {
    throw new AppError("VALIDATION_ERROR", "session_id is required", 400);
  }
  const draft = await getDraft(session_id);
  if (!draft.items || draft.items.length === 0) {
    throw new AppError("VALIDATION_ERROR", "No items selected", 400);
  }

  const [draftRows] = await pool.query(
    `SELECT id, user_id, vehicle_json
     FROM booking_drafts
     WHERE session_id = ?`,
    [session_id]
  );
  if (!draftRows[0] || !draftRows[0].user_id) {
    throw new AppError("VALIDATION_ERROR", "Booking details incomplete", 400);
  }

  const vehiclePayload = draftRows[0].vehicle_json
    ? typeof draftRows[0].vehicle_json === "string"
      ? JSON.parse(draftRows[0].vehicle_json)
      : draftRows[0].vehicle_json
    : null;

  if (!vehiclePayload || !vehiclePayload.registrationNumber) {
    throw new AppError("VALIDATION_ERROR", "Vehicle details missing", 400);
  }

  const [vehicleRows] = await pool.query(
    `SELECT id FROM vehicles WHERE user_id = ? AND license_plate = ?`,
    [draftRows[0].user_id, vehiclePayload.registrationNumber]
  );
  let vehicleId = vehicleRows[0]?.id;
  if (!vehicleId) {
    const [result] = await pool.query(
      `INSERT INTO vehicles (uuid_public, user_id, license_plate, make, model, year)
       VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?)`,
      [
        draftRows[0].user_id,
        vehiclePayload.registrationNumber,
        vehiclePayload.make || "",
        vehiclePayload.model || "",
        vehiclePayload.yearOfManufacture || null
      ]
    );
    vehicleId = result.insertId;
  }

  const [addressRows] = await pool.query(
    `SELECT id FROM addresses WHERE user_id = ? ORDER BY id DESC LIMIT 1`,
    [draftRows[0].user_id]
  );
  if (!addressRows[0]) {
    throw new AppError("VALIDATION_ERROR", "Address not found", 400);
  }

  const [bookingResult] = await pool.query(
    `INSERT INTO bookings
     (uuid_public, customer_id, mechanic_id, address_id, vehicle_id, slot_id, status, subtotal_eur, vat_eur, total_eur, notes)
     VALUES (UUID_TO_BIN(UUID()), ?, NULL, ?, ?, NULL, 'requested', ?, ?, ?, ?)`,
    [
      draftRows[0].user_id,
      addressRows[0].id,
      vehicleId,
      draft.subtotal,
      draft.vat,
      draft.total,
      draft.notes || null
    ]
  );

  for (const item of draft.items) {
    await pool.query(
      `INSERT INTO booking_items (booking_id, service_id, labour_minutes, parts_json, line_total_eur)
       VALUES (?, ?, ?, ?, ?)`,
      [bookingResult.insertId, item.service_id, 0, null, item.line_total_eur]
    );
  }

  const [mechanicRows] = await pool.query(
    `SELECT DISTINCT u.id
     FROM users u
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     WHERE u.status = 'active'
       AND (
         LOWER(u.role) = 'mechanic'
         OR LOWER(ur.role) = 'mechanic'
       )`
  );

  if (mechanicRows.length) {
    const offerValues = mechanicRows.map((row) => [bookingResult.insertId, row.id]);
    await pool.query(
      `INSERT INTO booking_offers (booking_id, mechanic_id)
       VALUES ?`,
      [offerValues]
    );
  }

  await pool.query(
    `UPDATE booking_drafts
     SET payment_status = ?, payment_provider = ?, payment_amount_eur = ?, payment_currency = ?
     WHERE session_id = ?`,
    ["paid", provider, draft.total, currency, session_id]
  );

  return { ok: true, status: "paid", amount: draft.total, currency, booking_id: bookingResult.insertId };
};

const setDraftAccountPassword = async ({ session_id, password }) => {
  if (!session_id || !password) {
    throw new AppError("VALIDATION_ERROR", "session_id and password are required", 400);
  }
  if (password.length < 10) {
    throw new AppError("VALIDATION_ERROR", "Password must be at least 10 characters", 400);
  }
  if (!/[A-Z]/.test(password)) {
    throw new AppError("VALIDATION_ERROR", "Password must include an uppercase letter", 400);
  }
  if (!/[0-9]/.test(password)) {
    throw new AppError("VALIDATION_ERROR", "Password must include a number", 400);
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new AppError("VALIDATION_ERROR", "Password must include a symbol", 400);
  }

  const [draftRows] = await pool.query(
    `SELECT bd.user_id, u.email
     FROM booking_drafts bd
     JOIN users u ON u.id = bd.user_id
     WHERE bd.session_id = ?`,
    [session_id]
  );

  const draft = draftRows[0];
  if (!draft?.user_id) {
    throw new AppError("VALIDATION_ERROR", "Draft user not found", 400);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, draft.user_id]);

  return { ok: true, email: draft.email, user_id: draft.user_id };
};

module.exports = { saveBookingDetails, getDraft, addDraftItem, removeDraftItem, payDraft, setDraftAccountPassword };
