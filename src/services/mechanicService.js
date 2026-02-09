const { pool } = require("../config/pool");

const getLatestAddress = async (userId) => {
  const [rows] = await pool.query(
    `SELECT line1, line2, city, postal_code, country,
            ST_Y(location) AS lat, ST_X(location) AS lng
     FROM addresses
     WHERE user_id = ?
     ORDER BY id DESC
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
};

const getQualifications = async (userId) => {
  const [rows] = await pool.query(
    `SELECT name FROM mechanic_qualifications
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows.map((row) => row.name);
};

const getMemberships = async (userId) => {
  const [rows] = await pool.query(
    `SELECT name FROM mechanic_memberships
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows.map((row) => row.name);
};

const addQualification = async ({ userId, name }) => {
  const trimmed = String(name || "").trim();
  if (!trimmed) return;
  await pool.query(
    "INSERT INTO mechanic_qualifications (user_id, name) VALUES (?, ?)",
    [userId, trimmed]
  );
};

const updateProfile = async ({ userId, years_experience, work_history, memberships }) => {
  const years = years_experience === "" || years_experience === undefined ? null : Number(years_experience);
  const history = String(work_history || "").trim() || null;

  await pool.query(
    `INSERT INTO mechanic_profiles (user_id, display_name, legal_name, years_experience, work_history)
     VALUES (?, '-', '-', ?, ?)
     ON DUPLICATE KEY UPDATE years_experience = VALUES(years_experience), work_history = VALUES(work_history)`,
    [userId, years, history]
  );

  await pool.query("DELETE FROM mechanic_memberships WHERE user_id = ?", [userId]);
  const list = Array.isArray(memberships) ? memberships : memberships ? [memberships] : [];
  for (const name of list) {
    const trimmed = String(name || "").trim();
    if (!trimmed) continue;
    await pool.query("INSERT INTO mechanic_memberships (user_id, name) VALUES (?, ?)", [userId, trimmed]);
  }
};

const getProfile = async (userId) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.email, u.created_at,
            p.name, p.lastname, p.avatar_url,
            mp.display_name, mp.about, mp.jobs_done, mp.rating_avg, mp.is_mobile, mp.vat_id,
            mp.years_experience, mp.work_history
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     LEFT JOIN mechanic_profiles mp ON mp.user_id = u.id
     WHERE u.id = ?`,
    [userId]
  );
  const user = rows[0];
  if (!user) return null;

  const address = await getLatestAddress(userId);
  const qualifications = await getQualifications(userId);
  const memberships = await getMemberships(userId);
  const name = user.display_name || [user.name, user.lastname].filter(Boolean).join(" ") || user.email;
  const location = address?.city || "Surrey";

  return {
    id: user.id,
    name,
    location,
    email: user.email,
    avatar_url: user.avatar_url,
    rating: user.rating_avg || 0,
    jobs_done: user.jobs_done || 0,
    created_at: user.created_at,
    is_mobile: user.is_mobile === null ? true : Boolean(user.is_mobile),
    vat_id: user.vat_id || null,
    years_experience: user.years_experience || null,
    work_history: user.work_history || "",
    address,
    qualifications,
    memberships
  };
};

module.exports = { getProfile, addQualification, updateProfile };
