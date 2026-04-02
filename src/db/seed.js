const bcrypt = require("bcryptjs");
const { pool } = require("../shared/config/pool");

const SEED = {
  roles: ["ADMIN", "MECHANIC", "CUSTOMER"],
  users: {
    admin: {
      full_name: "Admin User",
      email: "admin@smartworkshop.local",
      password: "Admin123!",
      role: "ADMIN"
    },
    mechanic: {
      full_name: "Mia Mechanic",
      email: "mechanic@smartworkshop.local",
      password: "Mechanic123!",
      role: "MECHANIC"
    },
    customer: {
      full_name: "Chris Customer",
      email: "customer@smartworkshop.local",
      password: "Customer123!",
      role: "CUSTOMER"
    }
  },
  workshop: {
    name: "Smart Workshop Central",
    address: "101 Main Street",
    postcode: "SW1A 1AA",
    phone: "+44 20 7946 0000",
    description: "General vehicle maintenance and diagnostics."
  }
};

const findRoleId = async (connection, roleName) => {
  const [rows] = await connection.query("SELECT role_id FROM roles WHERE role_name = ?", [roleName]);
  return rows[0] ? rows[0].role_id : null;
};

const ensureRole = async (connection, roleName) => {
  const existing = await findRoleId(connection, roleName);
  if (existing) return existing;
  const [result] = await connection.query("INSERT INTO roles (role_name) VALUES (?)", [roleName]);
  return result.insertId;
};

const ensureUser = async (connection, user, roleId) => {
  const [rows] = await connection.query("SELECT user_id FROM users WHERE email = ?", [user.email]);
  if (rows[0]) return rows[0].user_id;
  const passwordHash = await bcrypt.hash(user.password, 10);
  const [result] = await connection.query(
    "INSERT INTO users (full_name, email, password_hash, role_id) VALUES (?, ?, ?, ?)",
    [user.full_name, user.email, passwordHash, roleId]
  );
  return result.insertId;
};

const ensureWorkshop = async (connection) => {
  const [rows] = await connection.query("SELECT workshop_id FROM workshops WHERE name = ?", [SEED.workshop.name]);
  if (rows[0]) return rows[0].workshop_id;
  const [result] = await connection.query(
    "INSERT INTO workshops (name, address, postcode, phone, description) VALUES (?, ?, ?, ?, ?)",
    [
      SEED.workshop.name,
      SEED.workshop.address,
      SEED.workshop.postcode,
      SEED.workshop.phone,
      SEED.workshop.description
    ]
  );
  return result.insertId;
};

const ensureWorkshopMember = async (connection, workshopId, userId, memberRole) => {
  const [rows] = await connection.query(
    "SELECT workshop_member_id FROM workshop_members WHERE workshop_id = ? AND user_id = ?",
    [workshopId, userId]
  );
  if (rows[0]) return rows[0].workshop_member_id;
  const [result] = await connection.query(
    "INSERT INTO workshop_members (workshop_id, user_id, member_role) VALUES (?, ?, ?)",
    [workshopId, userId, memberRole]
  );
  return result.insertId;
};

const ensureSampleRequest = async (connection, customerId) => {
  const [rows] = await connection.query("SELECT request_id FROM service_requests WHERE customer_id = ?", [customerId]);
  if (rows[0]) return rows[0].request_id;
  const today = new Date().toISOString().slice(0, 10);
  const [result] = await connection.query(
    "INSERT INTO service_requests (customer_id, vehicle_reg, vehicle_make, vehicle_model, issue_description, preferred_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      customerId,
      "SW-1234",
      "Toyota",
      "Corolla",
      "Oil change and brake inspection.",
      today,
      "Submitted"
    ]
  );
  return result.insertId;
};

const seedDatabase = async () => {
  console.log("Seed skipped: schema has been migrated and seed data is not configured for the new model.");
};

module.exports = { seedDatabase };
