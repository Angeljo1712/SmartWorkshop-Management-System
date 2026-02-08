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

const roleLabel = (role) => {
  const normalized = String(role || "").toLowerCase();
  if (normalized === "user") return "CUSTOMER";
  if (normalized === "mechanic") return "MECHANIC";
  if (normalized === "admin") return "ADMIN";
  return String(role || "").toUpperCase();
};

const listUsers = async () => {
  const [rows] = await pool.query(
    `SELECT u.id, u.email, u.phone, u.created_at,
            p.name, p.lastname, p.avatar_url,
            GROUP_CONCAT(ur.role) AS roles
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     GROUP BY u.id
     ORDER BY u.created_at DESC`
  );
  return rows.map((row) => {
    const roles = (row.roles ? String(row.roles).split(",") : [row.role]).map(roleLabel);
    const primaryRole = roles.includes("ADMIN")
      ? "ADMIN"
      : roles.includes("MECHANIC")
        ? "MECHANIC"
        : "CUSTOMER";
    return {
      user_id: row.id,
      full_name: [row.name, row.lastname].filter(Boolean).join(" ") || "-",
      email: row.email,
      username: null,
      status: "active",
      last_active: row.created_at,
      role_name: primaryRole,
      roles,
      created_at: row.created_at,
      avatar_url: row.avatar_url,
      phone: row.phone
    };
  });
};

const setUserRole = async ({ userId, role, action }) => {
  const normalizedRole = String(role || "").trim().toLowerCase();
  if (!["user", "mechanic", "admin"].includes(normalizedRole)) {
    throw new AppError("ROLE_INVALID", "Role not supported", 400);
  }
  if (action === "remove") {
    await pool.query("DELETE FROM user_roles WHERE user_id = ? AND role = ?", [userId, normalizedRole]);
    return { user_id: userId, role: normalizedRole, action: "removed" };
  }
  await pool.query(
    "INSERT INTO user_roles (user_id, role) VALUES (?, ?) ON DUPLICATE KEY UPDATE role = role",
    [userId, normalizedRole]
  );
  return { user_id: userId, role: normalizedRole, action: "added" };
};

module.exports = { listWorkshops, createWorkshop, updateWorkshop, deleteWorkshop, listUsers, setUserRole };



