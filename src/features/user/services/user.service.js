const { pool } = require("../../../shared/config/pool");
const { env } = require("../../../shared/config/env");
const { AppError } = require("../../../shared/utils/appError");
const { issueInvoiceForBooking } = require("../../invoices/services/invoice.service");
const {
  ensureBookingCompletionTables,
  saveBookingCompletionArtifacts,
  getBookingCompletionArtifactsByBookingIds
} = require("../../bookings/services/bookingCompletion.service");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const toRoleLabel = (role) => {
  const normalized = String(role || "").toLowerCase();
  if (normalized === "user") return "CUSTOMER";
  if (normalized === "mechanic") return "MECHANIC";
  if (normalized === "admin") return "ADMIN";
  return String(role || "").toUpperCase();
};

const formatAddressRow = (row) =>
  [row?.line1, row?.line2, row?.city, row?.postal_code, row?.country]
    .filter((value) => String(value || "").trim())
    .join(", ");

const formatBookingReference = (value) => String(Number(value) || 0).padStart(8, "0");

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

const getAddressByLabel = async (userId, label) => {
  const [rows] = await pool.query(
    `SELECT id, line1, line2, city, postal_code, country,
            ST_Y(location) AS lat, ST_X(location) AS lng
     FROM addresses
     WHERE user_id = ? AND label = ?
     ORDER BY id DESC
     LIMIT 1`,
    [userId, label]
  );
  return rows[0] || null;
};

const geocodeAddress = async ({ line1, line2, city, postal_code, country }) => {
  const normalizedLine1 = String(line1 || "").trim();
  const normalizedLine2 = String(line2 || "").trim();
  const normalizedCity = String(city || "").trim();
  const normalizedPostcode = String(postal_code || "").trim().replace(/\s+/g, " ");
  const normalizedCountry = String(country || "").trim() || "GB";

  const queries = [
    [normalizedLine1, normalizedLine2, normalizedCity, normalizedPostcode, normalizedCountry],
    [normalizedLine1, normalizedCity, normalizedPostcode, normalizedCountry],
    [normalizedPostcode, normalizedCity, normalizedCountry],
    [normalizedPostcode, normalizedCountry]
  ]
    .map((parts) => parts.filter((value) => String(value || "").trim()).join(", "))
    .filter(Boolean);

  if (!queries.length || typeof fetch !== "function") {
    return null;
  }

  if (env.geoapify.apiKey) {
    for (const rawQuery of queries) {
      const query = encodeURIComponent(rawQuery);
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/search?text=${query}&limit=1&format=json&apiKey=${encodeURIComponent(env.geoapify.apiKey)}`,
          {
            headers: {
              "User-Agent": "SmartWorkshop/1.0"
            }
          }
        );
        if (!response.ok) continue;
        const results = await response.json();
        const match = Array.isArray(results?.results) ? results.results[0] : null;
        const lat = Number(match?.lat);
        const lng = Number(match?.lon);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          return { lat, lng };
        }
      } catch {
        continue;
      }
    }
  }

  for (const rawQuery of queries) {
    const query = encodeURIComponent(rawQuery);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=jsonv2&limit=1`, {
        headers: {
          "User-Agent": "SmartWorkshop/1.0"
        }
      });
      if (!response.ok) continue;
      const results = await response.json();
      const match = Array.isArray(results) ? results[0] : null;
      const lat = Number(match?.lat);
      const lng = Number(match?.lon);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng };
      }
    } catch {
      continue;
    }
  }
  return null;
};

const getUserById = async (userId) => {
  const [rows] = await pool.query(
    `SELECT u.id, BIN_TO_UUID(u.uuid_public) AS uuid_public, u.email, u.username, u.phone, u.role, u.status, u.created_at, u.last_login_at,
            p.name, p.lastname, p.avatar_url,
            GROUP_CONCAT(ur.role) AS roles
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     WHERE u.id = ?
     GROUP BY u.id`,
    [userId]
  );
  const user = rows[0];
  if (!user) return null;
  const addressRow = await getLatestAddress(userId);
  const address = formatAddressRow(addressRow) || "";
  const roles = (user.roles ? String(user.roles).split(",") : [user.role]).map(toRoleLabel);
  const primaryRole = roles.includes("ADMIN")
    ? "ADMIN"
    : roles.includes("MECHANIC")
      ? "MECHANIC"
      : "CUSTOMER";
  return {
    ...user,
    address,
    address_details: addressRow
      ? {
          line1: addressRow.line1 || "",
          line2: addressRow.line2 || "",
          city: addressRow.city || "",
          postal_code: addressRow.postal_code || "",
          country: addressRow.country || "GB"
        }
      : null,
    role_name: primaryRole,
    roles
  };
};

const resolveNames = (payload) => {
  if (payload.name && payload.lastname) {
    return { name: payload.name.trim(), lastname: payload.lastname.trim() };
  }
  if (payload.full_name) {
    const parts = String(payload.full_name).trim().split(/\s+/);
    const name = parts.shift() || "";
    const lastname = parts.join(" ") || "-";
    return { name, lastname };
  }
  return { name: null, lastname: null };
};

const updateUserProfile = async (userId, { name, lastname, full_name, phone, username, address }) => {
  const updates = [];
  const params = [];

  if (phone !== undefined) {
    updates.push("phone = ?");
    params.push(phone);
  }

  if (username !== undefined) {
    const normalized = String(username || "").trim().toLowerCase();
    if (!normalized) {
      throw new AppError("VALIDATION_ERROR", "username is required", 400);
    }
    if (!/^[a-z0-9._-]{3,64}$/.test(normalized)) {
      throw new AppError(
        "VALIDATION_ERROR",
        "username must be 3-64 chars and contain only letters, numbers, dot, underscore or hyphen",
        400
      );
    }
    const [existing] = await pool.query("SELECT id FROM users WHERE username = ? AND id <> ?", [
      normalized,
      userId
    ]);
    if (existing[0]) {
      throw new AppError("USERNAME_IN_USE", "Username already in use", 409);
    }
    updates.push("username = ?");
    params.push(normalized);
  }

  if (updates.length) {
    params.push(userId);
    await pool.query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params);
  }

  if (address !== undefined) {
    if (address && typeof address === "object") {
      const line1 = String(address.line1 || "").trim();
      const line2 = String(address.line2 || "").trim();
      const city = String(address.city || "").trim();
      const postalCode = String(address.postal_code || "").trim();
      const country = String(address.country || "GB").trim() || "GB";
      if (line1 && city && postalCode) {
        await pool.query(
          `INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
           VALUES (UUID_TO_BIN(UUID()), ?, 'Profile', ?, ?, ?, ?, ?, ST_GeomFromText('POINT(0 0)', 4326))`,
          [userId, line1, line2 || null, city, postalCode, country]
        );
      }
    } else {
      const normalizedAddress = String(address || "").trim();
      if (normalizedAddress) {
        await pool.query(
          `INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
           VALUES (UUID_TO_BIN(UUID()), ?, 'Profile', ?, NULL, '-', '-', 'GB', ST_GeomFromText('POINT(0 0)', 4326))`,
          [userId, normalizedAddress]
        );
      }
    }
  }

  const resolved = resolveNames({ name, lastname, full_name });
  if (resolved.name && resolved.lastname) {
    await pool.query(
      `INSERT INTO user_profiles (user_id, name, lastname)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), lastname = VALUES(lastname)`,
      [userId, resolved.name, resolved.lastname]
    );
  } else if (!updates.length && address === undefined) {
    throw new AppError("VALIDATION_ERROR", "No profile fields provided", 400);
  }

  return getUserById(userId);
};

const updateUserAvatar = async (userId, avatarUrl) => {
  await pool.query(
    `INSERT INTO user_profiles (user_id, name, lastname, avatar_url)
     VALUES (?, '-', '-', ?)
     ON DUPLICATE KEY UPDATE avatar_url = VALUES(avatar_url)`,
    [userId, avatarUrl]
  );
  return getUserById(userId);
};

const changeUserPassword = async (userId, { old_password, new_password }) => {
  const currentPassword = String(old_password || "");
  const nextPassword = String(new_password || "");

  if (!currentPassword || !nextPassword) {
    throw new AppError("VALIDATION_ERROR", "old_password and new_password are required", 400);
  }
  if (nextPassword.length < 10) {
    throw new AppError("VALIDATION_ERROR", "New password must be at least 10 characters long.", 400);
  }
  if (!/[A-Z]/.test(nextPassword)) {
    throw new AppError("VALIDATION_ERROR", "New password must include at least one uppercase letter.", 400);
  }
  if (!/[0-9]/.test(nextPassword)) {
    throw new AppError("VALIDATION_ERROR", "New password must include at least one number.", 400);
  }
  if (!/[^A-Za-z0-9]/.test(nextPassword)) {
    throw new AppError("VALIDATION_ERROR", "New password must include at least one special character.", 400);
  }

  const [rows] = await pool.query("SELECT password_hash FROM users WHERE id = ? LIMIT 1", [userId]);
  const user = rows[0];
  if (!user) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }

  const matches = await bcrypt.compare(currentPassword, user.password_hash);
  if (!matches) {
    throw new AppError("AUTH_FAILED", "Old password is incorrect.", 401);
  }
  if (currentPassword === nextPassword) {
    throw new AppError("VALIDATION_ERROR", "New password must be different from the old password.", 400);
  }

  const passwordHash = await bcrypt.hash(nextPassword, 10);
  await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, userId]);
  return { message: "Password updated." };
};

const mapVehicleRow = (row) => ({
  id: row.id,
  uuid_public: row.uuid_public,
  registrationNumber: row.license_plate,
  make: row.make || "",
  model: row.model || "",
  yearOfManufacture: row.year || null,
  fuelType: row.fuel_type || "",
  mileage: row.mileage || "-",
  motStatus: row.mot_status || "MOT status not available",
  taxStatus: row.tax_status || "Tax status not available"
});

const listUserVehicles = async (userId) => {
  const [rows] = await pool.query(
    `SELECT id,
            BIN_TO_UUID(uuid_public) AS uuid_public,
            license_plate,
            make,
            model,
            year,
            fuel_type,
            mileage,
            mot_status,
            tax_status
     FROM vehicles
     WHERE user_id = ?
     ORDER BY id ASC`,
    [userId]
  );

  return rows.map(mapVehicleRow);
};

const saveUserVehicle = async (userId, payload) => {
  const registrationNumber = String(payload.registrationNumber || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!registrationNumber) {
    throw new AppError("VALIDATION_ERROR", "registrationNumber is required", 400);
  }

  const make = String(payload.make || "").trim();
  const model = String(payload.model || "").trim();
  const year = payload.yearOfManufacture ? Number(payload.yearOfManufacture) : null;
  const fuelType = String(payload.fuelType || "").trim() || null;
  const mileage = String(payload.mileage || "").trim() || null;
  const motStatus = String(payload.motStatus || "").trim() || null;
  const taxStatus = String(payload.taxStatus || "").trim() || null;

  await pool.query(
    `INSERT INTO vehicles (uuid_public, user_id, license_plate, make, model, year, fuel_type, mileage, mot_status, tax_status)
     VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       make = VALUES(make),
       model = VALUES(model),
       year = VALUES(year),
       fuel_type = VALUES(fuel_type),
       mileage = VALUES(mileage),
       mot_status = VALUES(mot_status),
       tax_status = VALUES(tax_status)`,
    [userId, registrationNumber, make, model, Number.isFinite(year) ? year : null, fuelType, mileage, motStatus, taxStatus]
  );

  const [rows] = await pool.query(
    `SELECT id,
            BIN_TO_UUID(uuid_public) AS uuid_public,
            license_plate,
            make,
            model,
            year,
            fuel_type,
            mileage,
            mot_status,
            tax_status
     FROM vehicles
     WHERE user_id = ? AND license_plate = ?
     LIMIT 1`,
    [userId, registrationNumber]
  );

  return rows[0] ? mapVehicleRow(rows[0]) : null;
};

const deleteUserVehicle = async (userId, registrationNumber) => {
  const normalized = String(registrationNumber || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!normalized) {
    throw new AppError("VALIDATION_ERROR", "registrationNumber is required", 400);
  }

  try {
    await pool.query("DELETE FROM vehicles WHERE user_id = ? AND license_plate = ?", [userId, normalized]);
  } catch (error) {
    if (error && (error.code === "ER_ROW_IS_REFERENCED_2" || error.code === "ER_ROW_IS_REFERENCED")) {
      throw new AppError(
        "VEHICLE_DELETE_BLOCKED",
        "This vehicle cannot be removed because it is linked to existing bookings",
        409
      );
    }
    throw error;
  }
  return { deleted: true };
};

const listUserBookings = async (userId) => {
  await ensureBookingCompletionTables();
  const [rows] = await pool.query(
    `SELECT b.id,
            BIN_TO_UUID(b.uuid_public) AS uuid_public,
            b.status,
            b.notes,
            b.subtotal_eur,
            b.vat_eur,
            b.total_eur,
            b.created_at,
            a.line1,
            a.line2,
            a.city,
            a.postal_code,
            a.country,
            v.license_plate,
            v.make,
            v.model,
            v.year,
            boa.responded_at AS booking_assigned_at,
            s.start_at AS slot_start_at,
            s.end_at AS slot_end_at,
            up.name AS mechanic_name,
            up.lastname AS mechanic_lastname
     FROM bookings b
     LEFT JOIN addresses a ON a.id = b.address_id
     LEFT JOIN vehicles v ON v.id = b.vehicle_id
     LEFT JOIN booking_offers boa ON boa.booking_id = b.id AND boa.status = 'accepted'
     LEFT JOIN availability_slots s ON s.id = b.slot_id
     LEFT JOIN user_profiles up ON up.user_id = b.mechanic_id
     WHERE b.customer_id = ?
     ORDER BY b.created_at DESC`,
    [userId]
  );

  if (!rows.length) return [];

  const bookingIds = rows.map((row) => row.id);

  const [itemRows] = await pool.query(
    `SELECT bi.booking_id,
            sc.name,
            bi.labour_minutes,
            bi.parts_json,
            bi.line_total_eur
     FROM booking_items bi
     INNER JOIN service_catalog sc ON sc.id = bi.service_id
     WHERE bi.booking_id IN (?)`,
    [bookingIds]
  );

  const [paymentRows] = await pool.query(
    `SELECT p.booking_id, p.status, p.amount_eur, p.currency, p.provider_ref
     FROM payments p
     INNER JOIN (
       SELECT booking_id, MAX(id) AS latest_id
       FROM payments
       WHERE booking_id IN (?)
       GROUP BY booking_id
     ) latest ON latest.latest_id = p.id`,
    [bookingIds]
  );
  const [invoiceRows] = await pool.query(
    `SELECT booking_id, number, issued_at, totals_json, pdf_url
     FROM invoices
     WHERE booking_id IN (?)`,
    [bookingIds]
  );
  const completionByBooking = await getBookingCompletionArtifactsByBookingIds(bookingIds);
  const itemsByBooking = new Map();
  itemRows.forEach((row) => {
    const list = itemsByBooking.get(row.booking_id) || [];
    let parts = [];
    if (row.parts_json) {
      try {
        parts = typeof row.parts_json === "string" ? JSON.parse(row.parts_json) : row.parts_json;
      } catch (_err) {
        parts = [];
      }
    }
    list.push({
      name: row.name,
      labour_minutes: row.labour_minutes,
      parts,
      line_total_eur: row.line_total_eur
    });
    itemsByBooking.set(row.booking_id, list);
  });

  const paymentsByBooking = new Map(paymentRows.map((row) => [row.booking_id, row]));
  const invoicesByBooking = new Map(
    invoiceRows.map((row) => {
      let totals = null;
      try {
        totals = typeof row.totals_json === "string" ? JSON.parse(row.totals_json) : row.totals_json;
      } catch (_error) {
        totals = null;
      }
      const completion = completionByBooking.get(Number(row.booking_id)) || { photos: [], added_parts: [] };
      totals = totals && typeof totals === "object"
        ? {
            ...totals,
            completion: {
              photos: Array.isArray(completion.photos) ? completion.photos : [],
              added_parts: Array.isArray(completion.added_parts) ? completion.added_parts : []
            }
          }
        : {
            completion: {
              photos: Array.isArray(completion.photos) ? completion.photos : [],
              added_parts: Array.isArray(completion.added_parts) ? completion.added_parts : []
            }
          };
      return [row.booking_id, { number: row.number, issued_at: row.issued_at, pdf_url: row.pdf_url || null, totals }];
    })
  );

  return rows.map((row) => {
    const items = itemsByBooking.get(row.id) || [];
    const payment = paymentsByBooking.get(row.id) || null;
    const invoice = invoicesByBooking.get(row.id) || null;
    const completion = completionByBooking.get(Number(row.id)) || { photos: [], added_parts: [] };
    return {
      id: row.id,
      uuid_public: row.uuid_public,
      reference: formatBookingReference(row.id),
      status: row.status,
      notes: row.notes || "",
      totals: {
        subtotal_eur: Number(row.subtotal_eur || 0),
        vat_eur: Number(row.vat_eur || 0),
        total_eur: Number(row.total_eur || 0)
      },
      created_at: row.created_at,
      slot: row.slot_start_at
        ? {
            start_at: row.slot_start_at,
            end_at: row.slot_end_at
          }
        : null,
      address: {
        line1: row.line1 || "",
        line2: row.line2 || "",
        city: row.city || "",
        postal_code: row.postal_code || "",
        country: row.country || ""
      },
      vehicle: {
        registrationNumber: row.license_plate || "",
        make: row.make || "",
        model: row.model || "",
        yearOfManufacture: row.year || null
      },
      assigned_at: row.booking_assigned_at || null,
      mechanic: [row.mechanic_name, row.mechanic_lastname].filter(Boolean).join(" ") || null,
      payment: payment
        ? {
            status: payment.status,
            amount_eur: Number(payment.amount_eur || 0),
            currency: payment.currency,
            provider_ref: payment.provider_ref
          }
        : null,
      invoice,
      completion,
      items
    };
  });
};

const listMechanicBookingOffers = async (mechanicId) => {
  const [rows] = await pool.query(
    `SELECT bo.id,
            bo.status AS offer_status,
            bo.sent_at,
            bo.responded_at,
            b.id AS booking_id,
            BIN_TO_UUID(b.uuid_public) AS booking_uuid_public,
            b.status AS booking_status,
            b.notes,
            b.total_eur,
            b.created_at,
            a.line1,
            a.line2,
            a.city,
            a.postal_code,
            a.country,
            v.license_plate,
            v.make,
            v.model,
            v.year,
            up.name AS customer_name,
            up.lastname AS customer_lastname,
            u.email AS customer_email
     FROM booking_offers bo
     INNER JOIN bookings b ON b.id = bo.booking_id
     INNER JOIN users u ON u.id = b.customer_id
     LEFT JOIN user_profiles up ON up.user_id = b.customer_id
     LEFT JOIN addresses a ON a.id = b.address_id
     LEFT JOIN vehicles v ON v.id = b.vehicle_id
     WHERE bo.mechanic_id = ?
     ORDER BY
       CASE bo.status
         WHEN 'pending' THEN 0
         WHEN 'accepted' THEN 1
         WHEN 'declined' THEN 2
         WHEN 'expired' THEN 3
         ELSE 4
       END,
       bo.sent_at DESC`,
    [mechanicId]
  );

  if (!rows.length) return [];

  const bookingIds = [...new Set(rows.map((row) => row.booking_id))];
  const [itemRows] = await pool.query(
    `SELECT bi.booking_id,
            sc.name,
            bi.labour_minutes,
            bi.line_total_eur
     FROM booking_items bi
     INNER JOIN service_catalog sc ON sc.id = bi.service_id
     WHERE bi.booking_id IN (?)`,
    [bookingIds]
  );
  const itemsByBooking = new Map();
  itemRows.forEach((row) => {
    const list = itemsByBooking.get(row.booking_id) || [];
    list.push({
      name: row.name,
      labour_minutes: row.labour_minutes,
      line_total_eur: Number(row.line_total_eur || 0)
    });
    itemsByBooking.set(row.booking_id, list);
  });

  return rows.map((row) => ({
    offer_id: row.id,
    status: row.offer_status,
    sent_at: row.sent_at,
    responded_at: row.responded_at,
    booking: {
      id: row.booking_id,
      uuid_public: row.booking_uuid_public,
      reference: formatBookingReference(row.booking_id),
      status: row.booking_status,
      notes: row.notes || "",
      total_eur: Number(row.total_eur || 0),
      created_at: row.created_at
    },
    customer: {
      name: [row.customer_name, row.customer_lastname].filter(Boolean).join(" ") || "Customer",
      email: row.customer_email || ""
    },
    vehicle: {
      registrationNumber: row.license_plate || "",
      make: row.make || "",
      model: row.model || "",
      yearOfManufacture: row.year || null
    },
    address: {
      line1: row.line1 || "",
      line2: row.line2 || "",
      city: row.city || "",
      postal_code: row.postal_code || "",
      country: row.country || ""
    },
    items: itemsByBooking.get(row.booking_id) || []
  }));
};

const listMechanicAssignedBookings = async (mechanicId) => {
  await ensureBookingCompletionTables();
  const [rows] = await pool.query(
    `SELECT b.id AS booking_id,
            BIN_TO_UUID(b.uuid_public) AS booking_uuid_public,
            b.status AS booking_status,
            b.total_eur,
            b.created_at,
            a.line1,
            a.line2,
            a.city,
            a.postal_code,
            a.country,
            v.license_plate,
            v.make,
            v.model,
            v.year,
            up.name AS customer_name,
            up.lastname AS customer_lastname,
            u.email AS customer_email
     FROM bookings b
     INNER JOIN users u ON u.id = b.customer_id
     LEFT JOIN user_profiles up ON up.user_id = b.customer_id
     LEFT JOIN addresses a ON a.id = b.address_id
     LEFT JOIN vehicles v ON v.id = b.vehicle_id
     WHERE b.mechanic_id = ?
     ORDER BY b.created_at DESC`,
    [mechanicId]
  );

  if (!rows.length) return [];

  const bookingIds = rows.map((row) => row.booking_id);
  const [itemRows] = await pool.query(
    `SELECT bi.booking_id, sc.name, bi.labour_minutes, bi.line_total_eur
     FROM booking_items bi
     INNER JOIN service_catalog sc ON sc.id = bi.service_id
     WHERE bi.booking_id IN (?)`,
    [bookingIds]
  );
  const itemsByBooking = new Map();
  itemRows.forEach((row) => {
    const list = itemsByBooking.get(row.booking_id) || [];
    list.push({
      name: row.name,
      labour_minutes: row.labour_minutes,
      line_total_eur: Number(row.line_total_eur || 0)
    });
    itemsByBooking.set(row.booking_id, list);
  });

  const [paymentRows] = await pool.query(
    `SELECT p.booking_id, p.status, p.amount_eur, p.currency, p.provider_ref
     FROM payments p
     INNER JOIN (
       SELECT booking_id, MAX(id) AS latest_id
       FROM payments
       WHERE booking_id IN (?)
       GROUP BY booking_id
     ) latest ON latest.latest_id = p.id`,
    [bookingIds]
  );
  const [invoiceRows] = await pool.query(
    `SELECT booking_id, number, issued_at, totals_json, pdf_url
     FROM invoices
     WHERE booking_id IN (?)`,
    [bookingIds]
  );
  const completionByBooking = await getBookingCompletionArtifactsByBookingIds(bookingIds);

  const paymentsByBooking = new Map(paymentRows.map((row) => [row.booking_id, row]));
  const invoicesByBooking = new Map(
    invoiceRows.map((row) => {
      let totals = null;
      try {
        totals = typeof row.totals_json === "string" ? JSON.parse(row.totals_json) : row.totals_json;
      } catch (_error) {
        totals = null;
      }
      const completion = completionByBooking.get(Number(row.booking_id)) || { photos: [], added_parts: [] };
      totals = totals && typeof totals === "object"
        ? {
            ...totals,
            completion: {
              photos: Array.isArray(completion.photos) ? completion.photos : [],
              added_parts: Array.isArray(completion.added_parts) ? completion.added_parts : []
            }
          }
        : {
            completion: {
              photos: Array.isArray(completion.photos) ? completion.photos : [],
              added_parts: Array.isArray(completion.added_parts) ? completion.added_parts : []
            }
          };
      return [row.booking_id, { number: row.number, issued_at: row.issued_at, pdf_url: row.pdf_url || null, totals }];
    })
  );

  return rows.map((row) => {
    const payment = paymentsByBooking.get(row.booking_id) || null;
    const invoice = invoicesByBooking.get(row.booking_id) || null;
    const completion = completionByBooking.get(Number(row.booking_id)) || { photos: [], added_parts: [] };
    return {
      booking: {
        id: row.booking_id,
        reference: formatBookingReference(row.booking_id),
        uuid_public: row.booking_uuid_public,
        status: row.booking_status,
        total_eur: Number(row.total_eur || 0),
        created_at: row.created_at
      },
      customer: {
        name: [row.customer_name, row.customer_lastname].filter(Boolean).join(" ") || "Customer",
        email: row.customer_email || ""
      },
      vehicle: {
        registrationNumber: row.license_plate || "",
        make: row.make || "",
        model: row.model || "",
        yearOfManufacture: row.year || null
      },
      address: {
        line1: row.line1 || "",
        line2: row.line2 || "",
        city: row.city || "",
        postal_code: row.postal_code || "",
        country: row.country || ""
      },
      payment: payment
        ? {
            status: payment.status,
            amount_eur: Number(payment.amount_eur || 0),
            currency: payment.currency,
            provider_ref: payment.provider_ref
          }
        : null,
      invoice,
      completion,
      items: itemsByBooking.get(row.booking_id) || []
    };
  });
};

const listMechanicResolutionCases = async (mechanicId, { bookingId } = {}) => {
  const params = [mechanicId];
  let bookingFilter = "";
  if (Number.isInteger(Number(bookingId)) && Number(bookingId) > 0) {
    bookingFilter = " AND rc.booking_id = ? ";
    params.push(Number(bookingId));
  }
  const [rows] = await pool.query(
    `SELECT rc.id, rc.booking_id, rc.case_type, rc.subject, rc.reference, rc.status, rc.updated_at,
            b.total_eur,
            v.license_plate, v.make, v.model, v.year,
            a.line1, a.line2, a.city, a.postal_code, a.country,
            up.name AS customer_name, up.lastname AS customer_lastname, u.email AS customer_email
     FROM resolution_cases rc
     INNER JOIN bookings b ON b.id = rc.booking_id
     INNER JOIN users u ON u.id = rc.customer_id
     LEFT JOIN user_profiles up ON up.user_id = rc.customer_id
     LEFT JOIN addresses a ON a.id = b.address_id
     LEFT JOIN vehicles v ON v.id = b.vehicle_id
     WHERE rc.mechanic_id = ? ${bookingFilter}
     ORDER BY rc.updated_at DESC`,
    params
  );
  return rows.map((row) => ({
    id: row.id,
    booking_id: row.booking_id,
    type: row.case_type,
    subject: row.subject,
    reference: row.reference,
    status: row.status,
    updated_at: row.updated_at,
    booking: {
      id: row.booking_id,
      reference: formatBookingReference(row.booking_id),
      total_eur: Number(row.total_eur || 0)
    },
    customer: {
      name: [row.customer_name, row.customer_lastname].filter(Boolean).join(" ") || "Customer",
      email: row.customer_email || ""
    },
    vehicle: {
      registrationNumber: row.license_plate || "",
      make: row.make || "",
      model: row.model || "",
      yearOfManufacture: row.year || null
    },
    address: {
      line1: row.line1 || "",
      line2: row.line2 || "",
      city: row.city || "",
      postal_code: row.postal_code || "",
      country: row.country || ""
    }
  }));
};

const listUserResolutionCases = async (userId, { bookingId } = {}) => {
  const params = [userId];
  let bookingFilter = "";
  if (Number.isInteger(Number(bookingId)) && Number(bookingId) > 0) {
    bookingFilter = " AND rc.booking_id = ? ";
    params.push(Number(bookingId));
  }
  const [rows] = await pool.query(
    `SELECT rc.id, rc.booking_id, rc.case_type, rc.subject, rc.reference, rc.status, rc.updated_at,
            b.total_eur,
            v.license_plate, v.make, v.model, v.year,
            a.line1, a.line2, a.city, a.postal_code, a.country,
            up.name AS mechanic_name, up.lastname AS mechanic_lastname, u.email AS mechanic_email
     FROM resolution_cases rc
     INNER JOIN bookings b ON b.id = rc.booking_id
     INNER JOIN users u ON u.id = rc.mechanic_id
     LEFT JOIN user_profiles up ON up.user_id = rc.mechanic_id
     LEFT JOIN addresses a ON a.id = b.address_id
     LEFT JOIN vehicles v ON v.id = b.vehicle_id
     WHERE rc.customer_id = ? ${bookingFilter}
     ORDER BY rc.updated_at DESC`,
    params
  );
  return rows.map((row) => ({
    id: row.id,
    booking_id: row.booking_id,
    type: row.case_type,
    subject: row.subject,
    reference: row.reference,
    status: row.status,
    updated_at: row.updated_at,
    booking: {
      id: row.booking_id,
      reference: formatBookingReference(row.booking_id),
      total_eur: Number(row.total_eur || 0)
    },
    mechanic: {
      name: [row.mechanic_name, row.mechanic_lastname].filter(Boolean).join(" ") || "Mechanic",
      email: row.mechanic_email || ""
    },
    vehicle: {
      registrationNumber: row.license_plate || "",
      make: row.make || "",
      model: row.model || "",
      yearOfManufacture: row.year || null
    },
    address: {
      line1: row.line1 || "",
      line2: row.line2 || "",
      city: row.city || "",
      postal_code: row.postal_code || "",
      country: row.country || ""
    }
  }));
};

const openUserResolutionCase = async (userId, { booking_id, type }) => {
  const bookingId = Number(booking_id);
  const caseType = String(type || "general").trim().toLowerCase();
  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    throw new AppError("VALIDATION_ERROR", "booking_id is required", 400);
  }
  if (!["general", "complaint"].includes(caseType)) {
    throw new AppError("VALIDATION_ERROR", "type must be general or complaint", 400);
  }

  const [bookingRows] = await pool.query(
    `SELECT id, mechanic_id
     FROM bookings
     WHERE id = ? AND customer_id = ?`,
    [bookingId, userId]
  );
  const booking = bookingRows[0];
  if (!booking) {
    throw new AppError("NOT_FOUND", "Booking not found for this customer", 404);
  }
  if (!booking.mechanic_id) {
    throw new AppError("VALIDATION_ERROR", "This booking has no assigned mechanic yet", 400);
  }

  const [existingRows] = await pool.query(
    `SELECT id FROM resolution_cases
     WHERE booking_id = ? AND customer_id = ? AND case_type = ? AND status = 'open'
     ORDER BY id DESC
     LIMIT 1`,
    [bookingId, userId, caseType]
  );
  const existing = existingRows[0];
  if (existing) return existing.id;

  const [countRows] = await pool.query(
    "SELECT COALESCE(MAX(sequence_no), 0) AS max_sequence FROM resolution_cases WHERE booking_id = ?",
    [bookingId]
  );
  const nextSequence = Number(countRows[0]?.max_sequence || 0) + 1;
  const reference = `${formatBookingReference(bookingId)}/${nextSequence}`;
  const subject = caseType === "complaint" ? "Complaint" : "General Enquiry";

  const [result] = await pool.query(
    `INSERT INTO resolution_cases (booking_id, mechanic_id, customer_id, case_type, subject, sequence_no, reference, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'open')`,
    [bookingId, booking.mechanic_id, userId, caseType, subject, nextSequence, reference]
  );
  return result.insertId;
};

const getUserResolutionCaseDetail = async (userId, caseId) => {
  const id = Number(caseId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("VALIDATION_ERROR", "caseId is invalid", 400);
  }

  const [rows] = await pool.query(
    `SELECT rc.id, rc.booking_id, rc.case_type, rc.subject, rc.reference, rc.status, rc.updated_at,
            b.total_eur, b.created_at,
            v.license_plate, v.make, v.model, v.year,
            a.line1, a.line2, a.city, a.postal_code, a.country,
            up.name AS mechanic_name, up.lastname AS mechanic_lastname, u.email AS mechanic_email
     FROM resolution_cases rc
     INNER JOIN bookings b ON b.id = rc.booking_id
     INNER JOIN users u ON u.id = rc.mechanic_id
     LEFT JOIN user_profiles up ON up.user_id = rc.mechanic_id
     LEFT JOIN addresses a ON a.id = b.address_id
     LEFT JOIN vehicles v ON v.id = b.vehicle_id
     WHERE rc.id = ? AND rc.customer_id = ?
     LIMIT 1`,
    [id, userId]
  );
  const row = rows[0];
  if (!row) {
    throw new AppError("NOT_FOUND", "Resolution case not found", 404);
  }

  const [itemRows] = await pool.query(
    `SELECT sc.name, bi.labour_minutes, bi.line_total_eur
     FROM booking_items bi
     INNER JOIN service_catalog sc ON sc.id = bi.service_id
     WHERE bi.booking_id = ?`,
    [row.booking_id]
  );
  const [messageRows] = await pool.query(
    `SELECT rcm.id, rcm.body, rcm.created_at, rcm.sender_id,
            up.name, up.lastname, up.avatar_url, u.email
     FROM resolution_case_messages rcm
     INNER JOIN users u ON u.id = rcm.sender_id
     LEFT JOIN user_profiles up ON up.user_id = rcm.sender_id
     WHERE rcm.case_id = ?
     ORDER BY rcm.created_at ASC`,
    [id]
  );

  return {
    id: row.id,
    booking_id: row.booking_id,
    type: row.case_type,
    subject: row.subject,
    reference: row.reference,
    status: row.status,
    updated_at: row.updated_at,
    booking: {
      id: row.booking_id,
      reference: formatBookingReference(row.booking_id),
      total_eur: Number(row.total_eur || 0),
      created_at: row.created_at
    },
    mechanic: {
      name: [row.mechanic_name, row.mechanic_lastname].filter(Boolean).join(" ") || "Mechanic",
      email: row.mechanic_email || ""
    },
    vehicle: {
      registrationNumber: row.license_plate || "",
      make: row.make || "",
      model: row.model || "",
      yearOfManufacture: row.year || null
    },
    address: {
      line1: row.line1 || "",
      line2: row.line2 || "",
      city: row.city || "",
      postal_code: row.postal_code || "",
      country: row.country || ""
    },
    items: itemRows.map((item) => ({
      name: item.name,
      labour_minutes: item.labour_minutes,
      line_total_eur: Number(item.line_total_eur || 0)
    })),
    messages: messageRows.map((message) => ({
      id: message.id,
      body: message.body,
      created_at: message.created_at,
      sender_id: message.sender_id,
      sender_name: [message.name, message.lastname].filter(Boolean).join(" ") || message.email || "User",
      avatar_url: message.avatar_url || "",
      sender_role: message.sender_id === userId ? "customer" : "mechanic"
    }))
  };
};

const addUserResolutionMessage = async (userId, caseId, body) => {
  const text = String(body || "").trim();
  if (!text) {
    throw new AppError("VALIDATION_ERROR", "message is required", 400);
  }
  await getUserResolutionCaseDetail(userId, caseId);
  await pool.query(
    "INSERT INTO resolution_case_messages (case_id, sender_id, body) VALUES (?, ?, ?)",
    [Number(caseId), userId, text]
  );
  return getUserResolutionCaseDetail(userId, caseId);
};

const openMechanicResolutionCase = async (mechanicId, { booking_id, type }) => {
  const bookingId = Number(booking_id);
  const caseType = String(type || "general").trim().toLowerCase();
  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    throw new AppError("VALIDATION_ERROR", "booking_id is required", 400);
  }
  if (!["general", "complaint"].includes(caseType)) {
    throw new AppError("VALIDATION_ERROR", "type must be general or complaint", 400);
  }

  const [bookingRows] = await pool.query(
    `SELECT id, customer_id
     FROM bookings
     WHERE id = ? AND mechanic_id = ?`,
    [bookingId, mechanicId]
  );
  const booking = bookingRows[0];
  if (!booking) {
    throw new AppError("NOT_FOUND", "Booking not found for this mechanic", 404);
  }

  const [existingRows] = await pool.query(
    `SELECT id FROM resolution_cases
     WHERE booking_id = ? AND mechanic_id = ? AND case_type = ? AND status = 'open'
     ORDER BY id DESC
     LIMIT 1`,
    [bookingId, mechanicId, caseType]
  );
  const existing = existingRows[0];
  if (existing) {
    return existing.id;
  }

  const [countRows] = await pool.query(
    "SELECT COALESCE(MAX(sequence_no), 0) AS max_sequence FROM resolution_cases WHERE booking_id = ?",
    [bookingId]
  );
  const nextSequence = Number(countRows[0]?.max_sequence || 0) + 1;
  const reference = `${formatBookingReference(bookingId)}/${nextSequence}`;
  const subject = caseType === "complaint" ? "Complaint" : "General Enquiry";

  const [result] = await pool.query(
    `INSERT INTO resolution_cases (booking_id, mechanic_id, customer_id, case_type, subject, sequence_no, reference, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'open')`,
    [bookingId, mechanicId, booking.customer_id, caseType, subject, nextSequence, reference]
  );
  return result.insertId;
};

const getMechanicResolutionCaseDetail = async (mechanicId, caseId) => {
  const id = Number(caseId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("VALIDATION_ERROR", "caseId is invalid", 400);
  }

  const [rows] = await pool.query(
    `SELECT rc.id, rc.booking_id, rc.case_type, rc.subject, rc.reference, rc.status, rc.updated_at,
            b.total_eur, b.created_at,
            v.license_plate, v.make, v.model, v.year,
            a.line1, a.line2, a.city, a.postal_code, a.country,
            up.name AS customer_name, up.lastname AS customer_lastname, u.email AS customer_email
     FROM resolution_cases rc
     INNER JOIN bookings b ON b.id = rc.booking_id
     INNER JOIN users u ON u.id = rc.customer_id
     LEFT JOIN user_profiles up ON up.user_id = rc.customer_id
     LEFT JOIN addresses a ON a.id = b.address_id
     LEFT JOIN vehicles v ON v.id = b.vehicle_id
     WHERE rc.id = ? AND rc.mechanic_id = ?
     LIMIT 1`,
    [id, mechanicId]
  );
  const row = rows[0];
  if (!row) {
    throw new AppError("NOT_FOUND", "Resolution case not found", 404);
  }

  const [itemRows] = await pool.query(
    `SELECT sc.name, bi.labour_minutes, bi.line_total_eur
     FROM booking_items bi
     INNER JOIN service_catalog sc ON sc.id = bi.service_id
     WHERE bi.booking_id = ?`,
    [row.booking_id]
  );
  const [messageRows] = await pool.query(
    `SELECT rcm.id, rcm.body, rcm.created_at, rcm.sender_id,
            up.name, up.lastname, up.avatar_url, u.email
     FROM resolution_case_messages rcm
     INNER JOIN users u ON u.id = rcm.sender_id
     LEFT JOIN user_profiles up ON up.user_id = rcm.sender_id
     WHERE rcm.case_id = ?
     ORDER BY rcm.created_at ASC`,
    [id]
  );

  return {
    id: row.id,
    booking_id: row.booking_id,
    type: row.case_type,
    subject: row.subject,
    reference: row.reference,
    status: row.status,
    updated_at: row.updated_at,
    booking: {
      id: row.booking_id,
      reference: formatBookingReference(row.booking_id),
      total_eur: Number(row.total_eur || 0),
      created_at: row.created_at
    },
    customer: {
      name: [row.customer_name, row.customer_lastname].filter(Boolean).join(" ") || "Customer",
      email: row.customer_email || ""
    },
    vehicle: {
      registrationNumber: row.license_plate || "",
      make: row.make || "",
      model: row.model || "",
      yearOfManufacture: row.year || null
    },
    address: {
      line1: row.line1 || "",
      line2: row.line2 || "",
      city: row.city || "",
      postal_code: row.postal_code || "",
      country: row.country || ""
    },
    items: itemRows.map((item) => ({
      name: item.name,
      labour_minutes: item.labour_minutes,
      line_total_eur: Number(item.line_total_eur || 0)
    })),
    messages: messageRows.map((message) => ({
      id: message.id,
      body: message.body,
      created_at: message.created_at,
      sender_id: message.sender_id,
      sender_name: [message.name, message.lastname].filter(Boolean).join(" ") || message.email || "User",
      avatar_url: message.avatar_url || "",
      sender_role: message.sender_id === mechanicId ? "mechanic" : "customer"
    }))
  };
};

const addMechanicResolutionMessage = async (mechanicId, caseId, body) => {
  const text = String(body || "").trim();
  if (!text) {
    throw new AppError("VALIDATION_ERROR", "message is required", 400);
  }
  await getMechanicResolutionCaseDetail(mechanicId, caseId);
  await pool.query(
    "INSERT INTO resolution_case_messages (case_id, sender_id, body) VALUES (?, ?, ?)",
    [Number(caseId), mechanicId, text]
  );
  return getMechanicResolutionCaseDetail(mechanicId, caseId);
};

const getMechanicProfile = async (userId) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.email, u.created_at,
            p.name, p.lastname, p.avatar_url,
            mp.display_name, mp.about, mp.jobs_done, mp.rating_avg, mp.is_mobile, mp.vat_id,
            mp.years_experience, mp.work_history, mp.travel_radius_miles
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     LEFT JOIN mechanic_profiles mp ON mp.user_id = u.id
     WHERE u.id = ?`,
    [userId]
  );
  const user = rows[0];
  if (!user) return null;

  const contactAddress = (await getAddressByLabel(userId, "Contact")) || (await getLatestAddress(userId));
  const premisesAddress = await getAddressByLabel(userId, "Premises");
  const [qualificationRows] = await pool.query(
    `SELECT name
     FROM mechanic_qualifications
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );
  const [membershipRows] = await pool.query(
    `SELECT name
     FROM mechanic_memberships
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );

  const name = user.display_name || [user.name, user.lastname].filter(Boolean).join(" ") || user.email;
  const location = contactAddress?.city || "Surrey";
  const [serviceRows] = await pool.query(
    `SELECT service_type
     FROM mechanic_services_offered
     WHERE user_id = ?
     ORDER BY id ASC`,
    [userId]
  );

  return {
    id: user.id,
    name,
    location,
    email: user.email,
    avatar_url: user.avatar_url,
    rating: Number(user.rating_avg || 0),
    jobs_done: Number(user.jobs_done || 0),
    created_at: user.created_at,
    is_mobile: user.is_mobile === null ? true : Boolean(user.is_mobile),
    vat_id: user.vat_id || null,
    years_experience: user.years_experience || null,
    work_history: user.work_history || "",
    travel_radius_miles: user.travel_radius_miles || null,
    address: contactAddress,
    contact_address: contactAddress,
    premises_address: premisesAddress,
    qualifications: qualificationRows.map((row) => row.name).filter(Boolean),
    memberships: membershipRows.map((row) => row.name).filter(Boolean),
    services_offered: serviceRows.map((row) => row.service_type).filter(Boolean)
  };
};

const listMechanicServiceCoverage = async (userId) => {
  const [catalogRows] = await pool.query(
    `SELECT sc.id, sc.code, sc.name, sc.category, sc.group_name, sc.subcategory, sc.display_order,
            ms.enabled
     FROM service_catalog sc
     LEFT JOIN mechanic_services ms
       ON ms.service_id = sc.id AND ms.mechanic_id = ?
     ORDER BY
       COALESCE(sc.group_name, sc.category) ASC,
       COALESCE(sc.subcategory, '') ASC,
       sc.display_order ASC,
       sc.name ASC`,
    [userId]
  );

  const hasExplicitConfig = catalogRows.some((row) => row.enabled !== null && row.enabled !== undefined);
  const titleize = (value) =>
    String(value || "")
      .split("_")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const groups = new Map();
  for (const row of catalogRows) {
    const groupKey = row.group_name || row.category;
    const subKey = row.subcategory || "general";
    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        key: groupKey,
        label: titleize(groupKey),
        subcategories: new Map()
      });
    }
    const group = groups.get(groupKey);
    if (!group.subcategories.has(subKey)) {
      group.subcategories.set(subKey, {
        key: subKey,
        label: titleize(subKey),
        services: []
      });
    }
    group.subcategories.get(subKey).services.push({
      id: row.id,
      code: row.code,
      name: row.name,
      selected: hasExplicitConfig ? Boolean(row.enabled) : true
    });
  }

  return Array.from(groups.values()).map((group) => ({
    key: group.key,
    label: group.label,
    subcategories: Array.from(group.subcategories.values())
  }));
};

const updateMechanicServiceCoverage = async (userId, payload) => {
  const selectedIds = Array.isArray(payload?.service_ids)
    ? payload.service_ids.map((value) => Number(value)).filter((value) => Number.isInteger(value) && value > 0)
    : [];

  const [catalogRows] = await pool.query("SELECT id FROM service_catalog");
  const allIds = catalogRows.map((row) => Number(row.id)).filter(Number.isInteger);
  const selectedSet = new Set(selectedIds);

  await pool.query("DELETE FROM mechanic_services WHERE mechanic_id = ?", [userId]);
  for (const serviceId of allIds) {
    await pool.query(
      "INSERT INTO mechanic_services (mechanic_id, service_id, enabled) VALUES (?, ?, ?)",
      [userId, serviceId, selectedSet.has(serviceId) ? 1 : 0]
    );
  }

  return listMechanicServiceCoverage(userId);
};

const saveAddressWithLabel = async (userId, label, payload) => {
  const line1 = String(payload?.line1 || "").trim();
  const line2 = String(payload?.line2 || "").trim();
  const city = String(payload?.city || "").trim();
  const postalCode = String(payload?.postal_code || "").trim();
  const country = String(payload?.country || "GB").trim() || "GB";

  if (!line1 || !city || !postalCode) {
    return;
  }

  const existing = await getAddressByLabel(userId, label);
  const geocoded = await geocodeAddress({
    line1,
    line2,
    city,
    postal_code: postalCode,
    country
  });
  const lat = Number(geocoded?.lat ?? existing?.lat);
  const lng = Number(geocoded?.lng ?? existing?.lng);
  const hasExistingCoordinates = Number.isFinite(lat) && Number.isFinite(lng);
  const pointWkt = hasExistingCoordinates ? `POINT(${lng} ${lat})` : "POINT(0 0)";

  await pool.query("DELETE FROM addresses WHERE user_id = ? AND label = ?", [userId, label]);
  await pool.query(
    `INSERT INTO addresses (uuid_public, user_id, label, line1, line2, city, postal_code, country, location)
     VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?, ?, ?, ST_GeomFromText(?, 4326))`,
    [userId, label, line1, line2 || null, city, postalCode, country, pointWkt]
  );
};

const updateMechanicProfile = async (userId, payload) => {
  const years = payload.years_experience === "" || payload.years_experience === undefined
    ? null
    : Number(payload.years_experience);
  const workHistory = String(payload.work_history || "").trim() || null;
  const travelRadius = payload.travel_radius_miles === "" || payload.travel_radius_miles === undefined
    ? null
    : Number(payload.travel_radius_miles);
  const isMobile = payload.is_mobile ? 1 : 0;

  await pool.query(
    `INSERT INTO mechanic_profiles (user_id, display_name, legal_name, years_experience, work_history, travel_radius_miles, is_mobile)
     VALUES (?, '-', '-', ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       years_experience = VALUES(years_experience),
       work_history = VALUES(work_history),
       travel_radius_miles = VALUES(travel_radius_miles),
       is_mobile = VALUES(is_mobile)`,
    [userId, Number.isFinite(years) ? years : null, workHistory, Number.isFinite(travelRadius) ? travelRadius : null, isMobile]
  );

  await saveAddressWithLabel(userId, "Contact", payload.contact_address || {});
  if (payload.same_as_contact_address) {
    await pool.query("DELETE FROM addresses WHERE user_id = ? AND label = ?", [userId, "Premises"]);
  } else {
    await saveAddressWithLabel(userId, "Premises", payload.premises_address || {});
  }

  await pool.query("DELETE FROM mechanic_services_offered WHERE user_id = ?", [userId]);
  const services = Array.isArray(payload.services_offered) ? payload.services_offered : [];
  for (const serviceType of services) {
    const normalized = String(serviceType || "").trim();
    if (!normalized) continue;
    await pool.query(
      "INSERT INTO mechanic_services_offered (user_id, service_type) VALUES (?, ?)",
      [userId, normalized]
    );
  }

  return getMechanicProfile(userId);
};

const respondToMechanicBookingOffer = async (mechanicId, offerId, action) => {
  const normalizedAction = String(action || "").trim().toLowerCase();
  if (!["accept", "decline", "cancel"].includes(normalizedAction)) {
    throw new AppError("VALIDATION_ERROR", "action must be accept, decline or cancel", 400);
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [offerRows] = await connection.query(
      `SELECT bo.id,
              bo.booking_id,
              bo.status,
              b.mechanic_id,
              b.status AS booking_status,
              b.address_id
       FROM booking_offers bo
       INNER JOIN bookings b ON b.id = bo.booking_id
       WHERE bo.id = ? AND bo.mechanic_id = ?
       FOR UPDATE`,
      [offerId, mechanicId]
    );

    const offer = offerRows[0];
    if (!offer) {
      throw new AppError("NOT_FOUND", "Booking offer not found", 404);
    }

    if (normalizedAction === "accept") {
      if (offer.status !== "pending") {
        throw new AppError("VALIDATION_ERROR", `Offer is already ${offer.status}`, 400);
      }
      if (offer.mechanic_id || offer.booking_status === "accepted") {
        throw new AppError("CONFLICT", "This booking has already been accepted by another mechanic", 409);
      }

      await connection.query(
        `UPDATE booking_offers
         SET status = 'accepted', responded_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [offerId]
      );

      await connection.query(
        `UPDATE booking_offers
         SET status = 'expired', responded_at = CURRENT_TIMESTAMP
         WHERE booking_id = ? AND id <> ? AND status = 'pending'`,
        [offer.booking_id, offerId]
      );

      await connection.query(
        `UPDATE bookings
         SET mechanic_id = ?, status = 'accepted'
         WHERE id = ?`,
        [mechanicId, offer.booking_id]
      );
    } else if (normalizedAction === "decline") {
      if (offer.status !== "pending") {
        throw new AppError("VALIDATION_ERROR", `Offer is already ${offer.status}`, 400);
      }
      await connection.query(
        `UPDATE booking_offers
         SET status = 'declined', responded_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [offerId]
      );
    } else {
      if (offer.status !== "accepted") {
        throw new AppError("VALIDATION_ERROR", "Only accepted offers can be cancelled", 400);
      }
      if (Number(offer.mechanic_id || 0) !== Number(mechanicId) || offer.booking_status !== "accepted") {
        throw new AppError("CONFLICT", "This booking can no longer be cancelled by this mechanic", 409);
      }

      await connection.query(
        `UPDATE booking_offers
         SET status = 'declined', responded_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [offerId]
      );

      await connection.query(
        `UPDATE bookings
         SET mechanic_id = NULL, status = 'requested'
         WHERE id = ?`,
        [offer.booking_id]
      );

      const [serviceRows] = await connection.query(
        `SELECT service_id
         FROM booking_items
         WHERE booking_id = ?`,
        [offer.booking_id]
      );

      const serviceIds = [...new Set(
        serviceRows
          .map((row) => Number(row.service_id))
          .filter((value) => Number.isInteger(value) && value > 0)
      )];

      let eligibleMechanicIds = [];
      if (offer.address_id && serviceIds.length) {
        const [candidateRows] = await connection.query(
          `SELECT DISTINCT u.id
           FROM users u
           LEFT JOIN user_roles ur ON ur.user_id = u.id
           INNER JOIN mechanic_profiles mp ON mp.user_id = u.id
           INNER JOIN addresses booking_address ON booking_address.id = ?
           LEFT JOIN addresses contact_address
             ON contact_address.user_id = u.id AND contact_address.label = 'Contact'
           LEFT JOIN addresses premises_address
             ON premises_address.user_id = u.id AND premises_address.label = 'Premises'
           WHERE u.status = 'active'
             AND (
               LOWER(u.role) = 'mechanic'
               OR LOWER(ur.role) = 'mechanic'
             )
             AND mp.travel_radius_miles IS NOT NULL
             AND mp.travel_radius_miles > 0
             AND COALESCE(premises_address.location, contact_address.location) IS NOT NULL
             AND ST_Distance_Sphere(
               COALESCE(premises_address.location, contact_address.location),
               booking_address.location
             ) <= mp.travel_radius_miles * 1609.34`,
          [offer.address_id]
        );

        const candidateIds = candidateRows
          .map((row) => Number(row.id))
          .filter((value) => Number.isInteger(value) && value > 0 && value !== Number(mechanicId));

        if (candidateIds.length) {
          const [coverageRows] = await connection.query(
            `SELECT mechanic_id, service_id, enabled
             FROM mechanic_services
             WHERE mechanic_id IN (?)`,
            [candidateIds]
          );

          const coverageByMechanic = new Map();
          coverageRows.forEach((row) => {
            const candidateId = Number(row.mechanic_id);
            if (!coverageByMechanic.has(candidateId)) coverageByMechanic.set(candidateId, new Map());
            coverageByMechanic.get(candidateId).set(Number(row.service_id), Boolean(row.enabled));
          });

          eligibleMechanicIds = candidateIds.filter((candidateId) => {
            const mechanicCoverage = coverageByMechanic.get(candidateId);
            if (!mechanicCoverage || mechanicCoverage.size === 0) return true;
            return serviceIds.every((serviceId) => mechanicCoverage.get(serviceId) === true);
          });
        }
      }

      if (eligibleMechanicIds.length) {
        const [existingOfferRows] = await connection.query(
          `SELECT id, mechanic_id, status
           FROM booking_offers
           WHERE booking_id = ? AND mechanic_id IN (?)`,
          [offer.booking_id, eligibleMechanicIds]
        );

        const existingByMechanic = new Map(
          existingOfferRows.map((row) => [Number(row.mechanic_id), { id: Number(row.id), status: String(row.status || "").toLowerCase() }])
        );

        const expiredOfferIds = [];
        const missingOfferValues = [];

        eligibleMechanicIds.forEach((candidateId) => {
          const existing = existingByMechanic.get(candidateId);
          if (!existing) {
            missingOfferValues.push([offer.booking_id, candidateId]);
            return;
          }
          if (existing.status === "expired") {
            expiredOfferIds.push(existing.id);
          }
        });

        if (expiredOfferIds.length) {
          await connection.query(
            `UPDATE booking_offers
             SET status = 'pending', responded_at = NULL, sent_at = CURRENT_TIMESTAMP
             WHERE id IN (?)`,
            [expiredOfferIds]
          );
        }

        if (missingOfferValues.length) {
          await connection.query(
            `INSERT INTO booking_offers (booking_id, mechanic_id)
             VALUES ?`,
            [missingOfferValues]
          );
        }
      }
    }

    await connection.commit();
    return {
      ok: true,
      offer_id: offerId,
      status:
        normalizedAction === "accept"
          ? "accepted"
          : normalizedAction === "decline"
            ? "declined"
            : "cancelled"
    };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const completeMechanicAssignedBooking = async (mechanicId, bookingId, payload = {}, files = []) => {
  const [rows] = await pool.query(
    `SELECT b.id, b.status, b.mechanic_id
     FROM bookings b
     WHERE b.id = ?
     LIMIT 1`,
    [bookingId]
  );

  const booking = rows[0];
  if (!booking) {
    throw new AppError("BOOKING_NOT_FOUND", "Booking not found", 404);
  }
  if (Number(booking.mechanic_id || 0) !== Number(mechanicId)) {
    throw new AppError("FORBIDDEN", "This booking is not assigned to you", 403);
  }

  const normalizedStatus = String(booking.status || "").toLowerCase();
  if (!["accepted", "in_progress"].includes(normalizedStatus)) {
    throw new AppError("BOOKING_STATUS_INVALID", "Only accepted or in-progress bookings can be completed", 409);
  }

  const rawParts = payload.parts_json || payload.parts || "[]";
  let addedParts = [];
  try {
    const parsed = typeof rawParts === "string" ? JSON.parse(rawParts) : rawParts;
    addedParts = Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    throw new AppError("VALIDATION_ERROR", "Invalid parts payload", 400);
  }

  const photoUrls = Array.isArray(files)
    ? files.map((file) => `/uploads/booking-completion/${file.filename}`)
    : [];

  await pool.query("UPDATE bookings SET status = 'completed' WHERE id = ?", [bookingId]);
  await saveBookingCompletionArtifacts({
    bookingId,
    userId: mechanicId,
    photoUrls,
    addedParts
  });

  const invoice = await issueInvoiceForBooking(bookingId);

  const assignedBookings = await listMechanicAssignedBookings(mechanicId);
  return {
    booking: assignedBookings.find((entry) => Number(entry.booking?.id) === Number(bookingId)) || null,
    invoice
  };
};

const requestEmailChange = async (userId, newEmail) => {
  if (!newEmail) {
    throw new AppError("VALIDATION_ERROR", "email is required", 400);
  }
  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [newEmail]);
  if (existing[0]) {
    throw new AppError("EMAIL_IN_USE", "Email already registered", 409);
  }

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  await pool.query(
    "INSERT INTO email_change_requests (user_id, new_email, token, expires_at) VALUES (?, ?, ?, ?)",
    [userId, newEmail, token, expiresAt]
  );

  return { token, expiresAt };
};

const confirmEmailChange = async (token) => {
  if (!token) {
    throw new AppError("VALIDATION_ERROR", "token is required", 400);
  }

  const [rows] = await pool.query(
    `SELECT id, user_id, new_email, expires_at
     FROM email_change_requests
     WHERE token = ?`,
    [token]
  );
  const request = rows[0];
  if (!request) {
    throw new AppError("INVALID_TOKEN", "Invalid or expired token", 400);
  }
  if (new Date(request.expires_at).getTime() < Date.now()) {
    await pool.query("DELETE FROM email_change_requests WHERE id = ?", [request.id]);
    throw new AppError("INVALID_TOKEN", "Token expired", 400);
  }

  await pool.query("UPDATE users SET email = ? WHERE id = ?", [request.new_email, request.user_id]);
  await pool.query("DELETE FROM email_change_requests WHERE id = ?", [request.id]);
  return getUserById(request.user_id);
};

module.exports = {
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  changeUserPassword,
  requestEmailChange,
  confirmEmailChange,
  listUserVehicles,
  saveUserVehicle,
  deleteUserVehicle,
  listUserBookings,
  listMechanicBookingOffers,
  listMechanicAssignedBookings,
  listUserResolutionCases,
  openUserResolutionCase,
  getUserResolutionCaseDetail,
  addUserResolutionMessage,
  listMechanicResolutionCases,
  openMechanicResolutionCase,
  getMechanicResolutionCaseDetail,
  addMechanicResolutionMessage,
  getMechanicProfile,
  listMechanicServiceCoverage,
  updateMechanicServiceCoverage,
  updateMechanicProfile,
  respondToMechanicBookingOffer,
  completeMechanicAssignedBooking
};






