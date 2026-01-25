const { pool } = require("../db/pool");
const { AppError } = require("../utils/appError");

const createRequest = async (customerId, payload) => {
  const { vehicle_reg, vehicle_make, vehicle_model, issue_description, preferred_date } = payload;
  if (!vehicle_reg || !vehicle_make || !vehicle_model || !issue_description) {
    throw new AppError("VALIDATION_ERROR", "vehicle_reg, vehicle_make, vehicle_model, issue_description are required", 400);
  }

  const [result] = await pool.query(
    `INSERT INTO service_requests
     (customer_id, vehicle_reg, vehicle_make, vehicle_model, issue_description, preferred_date, status)
     VALUES (?, ?, ?, ?, ?, ?, 'Submitted')`,
    [customerId, vehicle_reg, vehicle_make, vehicle_model, issue_description, preferred_date || null]
  );

  const [rows] = await pool.query("SELECT * FROM service_requests WHERE request_id = ?", [result.insertId]);
  return rows[0];
};

const getRequestsForCustomer = async (customerId) => {
  const [rows] = await pool.query(
    "SELECT * FROM service_requests WHERE customer_id = ? ORDER BY created_at DESC",
    [customerId]
  );
  return rows;
};

const getRequestById = async (requestId) => {
  const [rows] = await pool.query("SELECT * FROM service_requests WHERE request_id = ?", [requestId]);
  return rows[0];
};

const getAvailableRequests = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM service_requests WHERE status = 'Submitted' ORDER BY created_at DESC"
  );
  return rows;
};

module.exports = { createRequest, getRequestsForCustomer, getRequestById, getAvailableRequests };
