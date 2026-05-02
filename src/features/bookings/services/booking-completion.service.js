const { pool } = require("../../../shared/config/pool");

let ensureCompletionTablesPromise = null;

const ensureBookingCompletionTables = async () => {
  if (!ensureCompletionTablesPromise) {
    ensureCompletionTablesPromise = (async () => {
      await pool.query(
        `CREATE TABLE IF NOT EXISTS booking_completion_photos (
          id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          booking_id BIGINT UNSIGNED NOT NULL,
          uploaded_by_user_id BIGINT UNSIGNED NOT NULL,
          file_url TEXT NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          KEY idx_bcp_booking (booking_id, created_at),
          KEY idx_bcp_user (uploaded_by_user_id),
          CONSTRAINT fk_bcp_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
          CONSTRAINT fk_bcp_user FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB`
      );

      await pool.query(
        `CREATE TABLE IF NOT EXISTS booking_completion_parts (
          id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          booking_id BIGINT UNSIGNED NOT NULL,
          description VARCHAR(255) NOT NULL,
          amount_eur DECIMAL(10,2) NOT NULL DEFAULT 0.00,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          KEY idx_bcp2_booking (booking_id, created_at),
          CONSTRAINT fk_bcp2_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
        ) ENGINE=InnoDB`
      );
    })().catch((error) => {
      ensureCompletionTablesPromise = null;
      throw error;
    });
  }

  return ensureCompletionTablesPromise;
};

const normalizeCompletionParts = (parts) =>
  (Array.isArray(parts) ? parts : [])
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

const saveBookingCompletionArtifacts = async ({ bookingId, userId, photoUrls = [], addedParts = [] }) => {
  await ensureBookingCompletionTables();

  const normalizedPhotos = (Array.isArray(photoUrls) ? photoUrls : [])
    .map((value) => String(value || "").trim())
    .filter(Boolean);
  const normalizedParts = normalizeCompletionParts(addedParts);

  await pool.query("DELETE FROM booking_completion_photos WHERE booking_id = ?", [bookingId]);
  await pool.query("DELETE FROM booking_completion_parts WHERE booking_id = ?", [bookingId]);

  if (normalizedPhotos.length) {
    await pool.query(
      `INSERT INTO booking_completion_photos (booking_id, uploaded_by_user_id, file_url)
       VALUES ?`,
      [normalizedPhotos.map((fileUrl) => [bookingId, userId, fileUrl])]
    );
  }

  if (normalizedParts.length) {
    await pool.query(
      `INSERT INTO booking_completion_parts (booking_id, description, amount_eur)
       VALUES ?`,
      [normalizedParts.map((part) => [bookingId, part.description, part.amount_eur])]
    );
  }

  return {
    photos: normalizedPhotos,
    added_parts: normalizedParts
  };
};

const getBookingCompletionArtifactsByBookingIds = async (bookingIds = []) => {
  const ids = [...new Set((Array.isArray(bookingIds) ? bookingIds : []).map((value) => Number(value)).filter((value) => value > 0))];
  if (!ids.length) return new Map();

  await ensureBookingCompletionTables();

  const [photoRows] = await pool.query(
    `SELECT booking_id, file_url
     FROM booking_completion_photos
     WHERE booking_id IN (?)
     ORDER BY id ASC`,
    [ids]
  );
  const [partRows] = await pool.query(
    `SELECT booking_id, description, amount_eur
     FROM booking_completion_parts
     WHERE booking_id IN (?)
     ORDER BY id ASC`,
    [ids]
  );

  const map = new Map(ids.map((id) => [id, { photos: [], added_parts: [] }]));

  photoRows.forEach((row) => {
    const bookingId = Number(row.booking_id);
    const entry = map.get(bookingId) || { photos: [], added_parts: [] };
    entry.photos.push(row.file_url);
    map.set(bookingId, entry);
  });

  partRows.forEach((row) => {
    const bookingId = Number(row.booking_id);
    const entry = map.get(bookingId) || { photos: [], added_parts: [] };
    entry.added_parts.push({
      description: row.description,
      amount_eur: Number(row.amount_eur || 0)
    });
    map.set(bookingId, entry);
  });

  return map;
};

module.exports = {
  ensureBookingCompletionTables,
  saveBookingCompletionArtifacts,
  getBookingCompletionArtifactsByBookingIds,
  normalizeCompletionParts
};
