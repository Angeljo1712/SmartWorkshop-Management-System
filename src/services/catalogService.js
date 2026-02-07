const { pool } = require("../config/pool");
const { AppError } = require("../utils/appError");

const listServices = async ({ category, region }) => {
  if (!category) {
    throw new AppError("VALIDATION_ERROR", "category is required", 400);
  }

  const [rows] = await pool.query(
    `SELECT sc.id, sc.code, sc.name, sc.category, sc.description,
            sp.labour_rate_eur AS price,
            sp.vat_pct
     FROM service_catalog sc
     LEFT JOIN service_pricing sp
       ON sp.service_id = sc.id AND sp.region = ?
     WHERE sc.category = ?
     ORDER BY sc.name ASC`,
    [region, category]
  );
  return rows;
};

module.exports = { listServices };
