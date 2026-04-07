const { pool } = require("../../../shared/config/pool");
const { AppError } = require("../../../shared/utils/appError");

const formatBookingReference = (value) => String(Number(value) || 0).padStart(8, "0");

const formatInvoiceNumber = (bookingId, issuedAt = new Date()) => {
  const stamp = [
    issuedAt.getUTCFullYear(),
    String(issuedAt.getUTCMonth() + 1).padStart(2, "0"),
    String(issuedAt.getUTCDate()).padStart(2, "0")
  ].join("");
  return `INV-${stamp}-${formatBookingReference(bookingId)}`;
};

const parseJsonValue = (value, fallback = null) => {
  if (value == null) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch (_error) {
    return fallback;
  }
};

const getPartAmount = (part) => {
  if (typeof part === "number" && Number.isFinite(part)) return Number(part);
  if (!part || typeof part !== "object") return 0;
  const candidates = [
    part.amount_eur,
    part.net_price,
    part.price_eur,
    part.total_eur,
    part.line_total_eur,
    part.price,
    part.amount,
    part.value
  ];
  const numeric = candidates
    .map((item) => Number(item))
    .find((item) => Number.isFinite(item));
  return Number.isFinite(numeric) ? numeric : 0;
};

const getPartDescription = (part) => {
  if (typeof part === "string") return part;
  if (!part || typeof part !== "object") return "Part";
  return part.name || part.description || part.label || part.title || "Part";
};

const getRoles = (roles, role) =>
  Array.from(
    new Set(
      (Array.isArray(roles) ? roles : role ? [role] : [])
        .map((item) => String(item || "").trim().toUpperCase())
        .filter(Boolean)
    )
  );

const getInvoiceContext = async (bookingId) => {
  const [rows] = await pool.query(
    `SELECT b.id AS booking_id,
            b.status AS booking_status,
            b.total_eur,
            b.subtotal_eur,
            b.vat_eur,
            b.created_at,
            b.customer_id,
            b.mechanic_id,
            c.email AS customer_email,
            c.phone AS customer_phone,
            cp.name AS customer_name,
            cp.lastname AS customer_lastname,
            m.email AS mechanic_email,
            m.phone AS mechanic_phone,
            mp.name AS mechanic_name,
            mp.lastname AS mechanic_lastname,
            a.line1,
            a.line2,
            a.city,
            a.postal_code,
            a.country,
            v.license_plate,
            v.make,
            v.model,
            v.year,
            p.status AS payment_status,
            p.amount_eur AS payment_amount_eur,
            p.currency AS payment_currency,
            p.provider_ref,
            inv.id AS invoice_id,
            inv.issuer_mechanic_id,
            inv.buyer_user_id,
            inv.number AS invoice_number,
            inv.issued_at,
            inv.totals_json,
            inv.pdf_url
     FROM bookings b
     INNER JOIN users c ON c.id = b.customer_id
     LEFT JOIN user_profiles cp ON cp.user_id = c.id
     LEFT JOIN users m ON m.id = b.mechanic_id
     LEFT JOIN user_profiles mp ON mp.user_id = m.id
     LEFT JOIN addresses a ON a.id = b.address_id
     LEFT JOIN vehicles v ON v.id = b.vehicle_id
     LEFT JOIN (
       SELECT p1.*
       FROM payments p1
       INNER JOIN (
         SELECT booking_id, MAX(id) AS latest_id
         FROM payments
         GROUP BY booking_id
       ) latest ON latest.latest_id = p1.id
     ) p ON p.booking_id = b.id
     LEFT JOIN invoices inv ON inv.booking_id = b.id
     WHERE b.id = ?
     LIMIT 1`,
    [bookingId]
  );

  if (!rows.length) {
    throw new AppError("BOOKING_NOT_FOUND", "Booking not found", 404);
  }

  const booking = rows[0];

  const [itemRows] = await pool.query(
    `SELECT sc.name,
            sc.description,
            bi.labour_minutes,
            bi.parts_json,
            bi.line_total_eur
     FROM booking_items bi
     INNER JOIN service_catalog sc ON sc.id = bi.service_id
     WHERE bi.booking_id = ?
     ORDER BY bi.id ASC`,
    [bookingId]
  );

  const items = itemRows.map((row) => {
    const parsedParts = parseJsonValue(row.parts_json, []);
    const parts = Array.isArray(parsedParts) ? parsedParts : [];
    return {
      name: row.name || "Service",
      description: row.description || row.name || "Service",
      labour_minutes: Number(row.labour_minutes || 0),
      line_total_eur: Number(row.line_total_eur || 0),
      parts
    };
  });

  return {
    booking,
    items
  };
};

const normalizeAddedParts = (parts) => {
  if (!Array.isArray(parts)) return [];
  return parts
    .map((part) => {
      if (!part || typeof part !== "object") return null;
      const description = String(part.description || part.name || "").trim();
      const amount = Number(part.amount_eur ?? part.amount ?? part.price ?? 0);
      if (!description) return null;
      return {
        description,
        amount_eur: Number.isFinite(amount) ? Number(amount.toFixed(2)) : 0
      };
    })
    .filter(Boolean);
};

const buildInvoiceTotals = (context, options = {}) => {
  const labourLines = [];
  const partLines = [];
  let labourTotal = 0;
  let partsTotal = 0;

  context.items.forEach((item) => {
    const parts = Array.isArray(item.parts) ? item.parts : [];
    const itemPartsTotal = parts.reduce((sum, part) => sum + getPartAmount(part), 0);
    const itemLabourTotal = Math.max(0, Number(item.line_total_eur || 0) - itemPartsTotal);
    labourTotal += itemLabourTotal;
    partsTotal += itemPartsTotal;

    labourLines.push({
      description: item.name || item.description || "Service labour",
      amount_eur: Number(itemLabourTotal.toFixed(2))
    });

    parts.forEach((part) => {
      partLines.push({
        description: getPartDescription(part),
        amount_eur: Number(getPartAmount(part).toFixed(2))
      });
    });
  });

  const addedParts = normalizeAddedParts(options.added_parts);
  addedParts.forEach((part) => {
    partLines.push(part);
    partsTotal += Number(part.amount_eur || 0);
  });

  const total = Number(context.booking.payment_amount_eur || context.booking.total_eur || labourTotal + partsTotal || 0);
  const subtotal = Number(context.booking.subtotal_eur || total);
  const vat = Number(context.booking.vat_eur || 0);
  labourTotal = Math.max(0, total - partsTotal - vat);

  return {
    labour_lines: labourLines,
    parts_lines: partLines,
    completion: {
      photos: Array.isArray(options.photos) ? options.photos : [],
      added_parts: addedParts
    },
    totals: {
      labour_eur: Number(labourTotal.toFixed(2)),
      parts_eur: Number(partsTotal.toFixed(2)),
      subtotal_eur: Number(subtotal.toFixed(2)),
      vat_eur: Number(vat.toFixed(2)),
      total_eur: Number(total.toFixed(2)),
      currency: context.booking.payment_currency || "GBP"
    }
  };
};

const hydrateInvoice = (context) => {
  const booking = context.booking;
  const totals =
    parseJsonValue(booking.totals_json, null) ||
    buildInvoiceTotals(context);

  return {
    id: booking.invoice_id || null,
    booking_id: booking.booking_id,
    invoice_number: booking.invoice_number || null,
    issued_at: booking.issued_at || null,
    pdf_url: booking.pdf_url || null,
    booking: {
      id: booking.booking_id,
      reference: formatBookingReference(booking.booking_id),
      status: booking.booking_status,
      created_at: booking.created_at
    },
    customer: {
      full_name: [booking.customer_name, booking.customer_lastname].filter(Boolean).join(" ") || booking.customer_email || "Customer",
      email: booking.customer_email || "",
      phone: booking.customer_phone || "",
      address: [booking.line1, booking.line2, booking.city, booking.postal_code, booking.country].filter(Boolean)
    },
    mechanic: {
      full_name: [booking.mechanic_name, booking.mechanic_lastname].filter(Boolean).join(" ") || booking.mechanic_email || "Mechanic",
      email: booking.mechanic_email || "",
      phone: booking.mechanic_phone || ""
    },
    vehicle: {
      registration: booking.license_plate || "",
      description: [booking.make, booking.model, booking.year].filter(Boolean).join(" ") || booking.license_plate || "-"
    },
    payment: {
      status: booking.payment_status || null,
      amount_eur: Number(booking.payment_amount_eur || 0),
      currency: booking.payment_currency || "GBP",
      provider_ref: booking.provider_ref || ""
    },
    totals
  };
};

const issueInvoiceForBooking = async (bookingId, options = {}) => {
  const context = await getInvoiceContext(bookingId);
  if (context.booking.invoice_id) {
    return hydrateInvoice(context);
  }
  if (String(context.booking.booking_status || "").toLowerCase() !== "completed") {
    throw new AppError("INVOICE_NOT_READY", "Invoice can only be issued for completed bookings", 409);
  }
  if (!context.booking.mechanic_id) {
    throw new AppError("INVOICE_MECHANIC_REQUIRED", "Completed booking must have an assigned mechanic", 409);
  }

  const issuedAt = new Date();
  const invoiceNumber = formatInvoiceNumber(bookingId, issuedAt);
  const totals = buildInvoiceTotals(context, options);

  await pool.query(
    `INSERT INTO invoices (booking_id, issuer_mechanic_id, buyer_user_id, number, issued_at, totals_json, pdf_url)
     VALUES (?, ?, ?, ?, ?, ?, NULL)
     ON DUPLICATE KEY UPDATE totals_json = VALUES(totals_json), pdf_url = VALUES(pdf_url)`,
    [
      bookingId,
      context.booking.mechanic_id,
      context.booking.customer_id,
      invoiceNumber,
      issuedAt.toISOString().slice(0, 19).replace("T", " "),
      JSON.stringify(totals)
    ]
  );

  const refreshed = await getInvoiceContext(bookingId);
  return hydrateInvoice(refreshed);
};

const getInvoiceForBooking = async ({ bookingId, userId, roles, role }) => {
  const context = await getInvoiceContext(bookingId);
  const normalizedRoles = getRoles(roles, role);
  const isAdmin = normalizedRoles.includes("ADMIN");
  const isOwner = Number(context.booking.customer_id || 0) === Number(userId || 0);
  const isMechanic =
    Number(context.booking.mechanic_id || 0) === Number(userId || 0) ||
    Number(context.booking.issuer_mechanic_id || 0) === Number(userId || 0);

  if (!isAdmin && !isOwner && !isMechanic) {
    throw new AppError("FORBIDDEN", "You do not have access to this invoice", 403);
  }

  if (!context.booking.invoice_id) {
    if (String(context.booking.booking_status || "").toLowerCase() !== "completed") {
      throw new AppError("INVOICE_NOT_READY", "Invoice not available until the work is completed", 409);
    }
    return issueInvoiceForBooking(bookingId);
  }

  return hydrateInvoice(context);
};

module.exports = {
  issueInvoiceForBooking,
  getInvoiceForBooking
};
