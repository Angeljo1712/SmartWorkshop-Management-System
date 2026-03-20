const { pool } = require("../config/pool");
const { AppError } = require("../utils/appError");

const listServices = async ({ category, region }) => {
  if (!category) {
    throw new AppError("VALIDATION_ERROR", "category is required", 400);
  }

  const [rows] = await pool.query(
    `SELECT sc.id, sc.code, sc.name, sc.category, sc.group_name, sc.subcategory, sc.display_order,
            sc.description, sc.base_labour_minutes,
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

const toTitle = (value) =>
  String(value || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const listServiceTree = async ({ region }) => {
  const [rows] = await pool.query(
    `SELECT sc.id, sc.code, sc.name, sc.category, sc.group_name, sc.subcategory, sc.display_order,
            sc.description, sc.base_labour_minutes,
            sp.labour_rate_eur AS price,
            sp.vat_pct
     FROM service_catalog sc
     LEFT JOIN service_pricing sp
       ON sp.service_id = sc.id AND sp.region = ?
     ORDER BY
       COALESCE(sc.group_name, sc.category) ASC,
       COALESCE(sc.subcategory, '') ASC,
       sc.display_order ASC,
       sc.name ASC`,
    [region]
  );

  const groups = new Map();
  for (const row of rows) {
    const groupKey = row.group_name || row.category;
    const subKey = row.subcategory || "general";
    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        key: groupKey,
        label: toTitle(groupKey),
        subcategories: new Map()
      });
    }
    const group = groups.get(groupKey);
    if (!group.subcategories.has(subKey)) {
      group.subcategories.set(subKey, {
        key: subKey,
        label: toTitle(subKey),
        services: []
      });
    }
    group.subcategories.get(subKey).services.push(row);
  }

  return Array.from(groups.values()).map((group) => ({
    key: group.key,
    label: group.label,
    subcategories: Array.from(group.subcategories.values())
  }));
};

module.exports = { listServices, listServiceTree };
