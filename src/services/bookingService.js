const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { pool } = require("../config/pool");
const { AppError } = require("../utils/appError");

const normalizeName = (value) => String(value || "").trim();

const buildAddress = ({ address1, address2, city, postcode }) =>
  [address1, address2, city, postcode].map((part) => String(part || "").trim()).filter(Boolean).join(", ");

const saveBookingDetails = async (payload) => {
  const firstName = normalizeName(payload.first_name);
  const lastName = normalizeName(payload.last_name);
  const email = normalizeName(payload.email).toLowerCase();
  const phone = normalizeName(payload.phone);
  const address = buildAddress({
    address1: payload.address1,
    address2: payload.address2,
    city: payload.city,
    postcode: payload.postcode
  });

  if (!firstName || !lastName || !email || !phone || !address) {
    throw new AppError("VALIDATION_ERROR", "first_name, last_name, email, phone, address are required", 400);
  }

  const fullName = `${firstName} ${lastName}`.trim();
  const [existing] = await pool.query("SELECT user_id FROM users WHERE email = ?", [email]);

  if (existing[0]) {
    await pool.query("UPDATE users SET full_name = ?, phone = ?, address = ? WHERE user_id = ?", [
      fullName,
      phone,
      address,
      existing[0].user_id
    ]);
    return { customerId: existing[0].user_id };
  }

  const [roleRows] = await pool.query("SELECT role_id FROM roles WHERE role_name = ?", ["CUSTOMER"]);
  if (!roleRows[0]) {
    throw new AppError("ROLE_MISSING", "Customer role not configured", 500);
  }

  const passwordHash = await bcrypt.hash(crypto.randomBytes(18).toString("hex"), 10);
  const [result] = await pool.query(
    "INSERT INTO users (full_name, email, username, password_hash, role_id, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [fullName, email, null, passwordHash, roleRows[0].role_id, phone, address]
  );

  return { customerId: result.insertId };
};

module.exports = { saveBookingDetails };
