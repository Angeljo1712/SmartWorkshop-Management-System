const { pool } = require("../../../shared/config/pool");

let ensureResolutionCaseAttachmentTablesPromise = null;

const ensureResolutionCaseAttachmentTables = async () => {
  if (!ensureResolutionCaseAttachmentTablesPromise) {
    ensureResolutionCaseAttachmentTablesPromise = (async () => {
      await pool.query(
        `CREATE TABLE IF NOT EXISTS resolution_case_message_attachments (
          id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          message_id BIGINT UNSIGNED NOT NULL,
          file_url TEXT NOT NULL,
          original_name VARCHAR(255) NULL,
          mime_type VARCHAR(100) NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          KEY idx_rcma_message (message_id, created_at),
          CONSTRAINT fk_rcma_message FOREIGN KEY (message_id) REFERENCES resolution_case_messages(id) ON DELETE CASCADE
        ) ENGINE=InnoDB`
      );
    })().catch((error) => {
      ensureResolutionCaseAttachmentTablesPromise = null;
      throw error;
    });
  }

  return ensureResolutionCaseAttachmentTablesPromise;
};

const normalizeResolutionCaseAttachmentFiles = (files = []) =>
  (Array.isArray(files) ? files : [])
    .map((file) => {
      if (!file) return null;
      if (typeof file === "string") {
        const fileUrl = String(file || "").trim();
        return fileUrl ? { file_url: fileUrl, original_name: "", mime_type: "" } : null;
      }
      const filename = String(file.filename || "").trim();
      const fileUrl = String(file.fileUrl || file.url || (filename ? `/uploads/resolution-case-attachments/${filename}` : "")).trim();
      if (!fileUrl) return null;
      return {
        file_url: fileUrl,
        original_name: String(file.originalname || "").trim(),
        mime_type: String(file.mimetype || "").trim()
      };
    })
    .filter(Boolean);

const saveResolutionCaseMessageAttachments = async ({ messageId, files = [] }) => {
  const normalizedFiles = normalizeResolutionCaseAttachmentFiles(files);
  if (!normalizedFiles.length) {
    return [];
  }

  await ensureResolutionCaseAttachmentTables();
  await pool.query(
    `INSERT INTO resolution_case_message_attachments (message_id, file_url, original_name, mime_type)
     VALUES ?`,
    [
      normalizedFiles.map((file) => [
        messageId,
        file.file_url,
        file.original_name || null,
        file.mime_type || null
      ])
    ]
  );
  return normalizedFiles;
};

const getResolutionCaseAttachmentsByMessageIds = async (messageIds = []) => {
  const ids = [...new Set((Array.isArray(messageIds) ? messageIds : []).map((value) => Number(value)).filter((value) => value > 0))];
  if (!ids.length) return new Map();

  await ensureResolutionCaseAttachmentTables();

  const [rows] = await pool.query(
    `SELECT message_id, file_url, original_name, mime_type
     FROM resolution_case_message_attachments
     WHERE message_id IN (?)
     ORDER BY id ASC`,
    [ids]
  );

  const map = new Map(ids.map((id) => [id, []]));
  rows.forEach((row) => {
    const messageId = Number(row.message_id);
    const entry = map.get(messageId) || [];
    entry.push({
      file_url: row.file_url,
      original_name: row.original_name || "",
      mime_type: row.mime_type || ""
    });
    map.set(messageId, entry);
  });

  return map;
};

module.exports = {
  ensureResolutionCaseAttachmentTables,
  saveResolutionCaseMessageAttachments,
  getResolutionCaseAttachmentsByMessageIds,
  normalizeResolutionCaseAttachmentFiles
};
