const { pool } = require("../config/pool");
const { AppError } = require("../utils/appError");

const listWorkshops = async () => {
  const [rows] = await pool.query("SELECT * FROM workshops ORDER BY created_at DESC");
  return rows;
};

const createWorkshop = async (payload) => {
  const { name, address, postcode, phone, description } = payload;
  if (!name || !address || !postcode || !phone) {
    throw new AppError("VALIDATION_ERROR", "name, address, postcode, phone are required", 400);
  }
  const [result] = await pool.query(
    "INSERT INTO workshops (name, address, postcode, phone, description) VALUES (?, ?, ?, ?, ?)",
    [name, address, postcode, phone, description || null]
  );
  const [rows] = await pool.query("SELECT * FROM workshops WHERE workshop_id = ?", [result.insertId]);
  return rows[0];
};

const updateWorkshop = async (workshopId, payload) => {
  const fields = ["name", "address", "postcode", "phone", "description"];
  const updates = fields.filter((field) => payload[field] !== undefined);
  if (updates.length === 0) {
    throw new AppError("VALIDATION_ERROR", "No fields to update", 400);
  }

  const setClause = updates.map((field) => `${field} = ?`).join(", ");
  const values = updates.map((field) => payload[field]);
  values.push(workshopId);

  await pool.query(`UPDATE workshops SET ${setClause} WHERE workshop_id = ?`, values);
  const [rows] = await pool.query("SELECT * FROM workshops WHERE workshop_id = ?", [workshopId]);
  return rows[0];
};

const deleteWorkshop = async (workshopId) => {
  await pool.query("DELETE FROM workshops WHERE workshop_id = ?", [workshopId]);
  return { deleted: true };
};

const listUsers = async () => {
  const [rows] = await pool.query(
    `SELECT u.user_id, u.full_name, u.email, r.role_name, u.created_at
     FROM users u
     JOIN roles r ON u.role_id = r.role_id
     ORDER BY u.created_at DESC`
  );
  return rows;
};

module.exports = { listWorkshops, createWorkshop, updateWorkshop, deleteWorkshop, listUsers };
