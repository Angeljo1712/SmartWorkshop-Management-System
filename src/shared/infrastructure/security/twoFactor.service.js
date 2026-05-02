const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { pool } = require("../../config/pool");
const { AppError } = require("../../utils/appError");

let ensureTwoFactorTablesPromise = null;

const ensureTwoFactorTables = async () => {
  if (!ensureTwoFactorTablesPromise) {
    ensureTwoFactorTablesPromise = (async () => {
      await pool.query(
        `CREATE TABLE IF NOT EXISTS user_security_settings (
          user_id BIGINT UNSIGNED PRIMARY KEY,
          two_factor_email_enabled TINYINT(1) NOT NULL DEFAULT 0,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT fk_uss_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB`
      );

      await pool.query(
        `CREATE TABLE IF NOT EXISTS login_two_factor_challenges (
          id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          user_id BIGINT UNSIGNED NOT NULL,
          challenge_token CHAR(64) NOT NULL UNIQUE,
          code_hash TEXT NOT NULL,
          expires_at DATETIME NOT NULL,
          consumed_at DATETIME NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          KEY idx_l2fc_user (user_id, created_at),
          KEY idx_l2fc_expires (expires_at),
          CONSTRAINT fk_l2fc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB`
      );
    })().catch((error) => {
      ensureTwoFactorTablesPromise = null;
      throw error;
    });
  }

  return ensureTwoFactorTablesPromise;
};

const getTwoFactorEmailSettings = async (userId) => {
  await ensureTwoFactorTables();
  const [rows] = await pool.query(
    `SELECT user_id, two_factor_email_enabled
     FROM user_security_settings
     WHERE user_id = ?
     LIMIT 1`,
    [userId]
  );
  return {
    user_id: Number(userId),
    two_factor_email_enabled: Boolean(rows[0]?.two_factor_email_enabled)
  };
};

const setTwoFactorEmailEnabled = async (userId, enabled) => {
  await ensureTwoFactorTables();
  const normalizedEnabled = enabled ? 1 : 0;
  await pool.query(
    `INSERT INTO user_security_settings (user_id, two_factor_email_enabled)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE two_factor_email_enabled = VALUES(two_factor_email_enabled)`,
    [userId, normalizedEnabled]
  );
  return getTwoFactorEmailSettings(userId);
};

const createLoginTwoFactorChallenge = async (userId, ttlMinutes = 10) => {
  await ensureTwoFactorTables();
  const challengeToken = crypto.randomBytes(32).toString("hex");
  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

  await pool.query(
    `INSERT INTO login_two_factor_challenges (user_id, challenge_token, code_hash, expires_at)
     VALUES (?, ?, ?, ?)`,
    [userId, challengeToken, codeHash, expiresAt]
  );

  return { challengeToken, code, expiresAt };
};

const verifyLoginTwoFactorChallenge = async ({ challengeToken, code }) => {
  await ensureTwoFactorTables();
  const normalizedToken = String(challengeToken || "").trim();
  const normalizedCode = String(code || "").replace(/\D+/g, "").slice(0, 6);

  if (!normalizedToken || normalizedCode.length !== 6) {
    throw new AppError("VALIDATION_ERROR", "challenge_token and code are required", 400);
  }

  const [rows] = await pool.query(
    `SELECT id, user_id, code_hash, expires_at, consumed_at
     FROM login_two_factor_challenges
     WHERE challenge_token = ?
     LIMIT 1`,
    [normalizedToken]
  );
  const challenge = rows[0];
  if (!challenge) {
    throw new AppError("INVALID_2FA_CHALLENGE", "Invalid or expired verification code", 400);
  }
  if (challenge.consumed_at) {
    throw new AppError("INVALID_2FA_CHALLENGE", "This verification code has already been used", 400);
  }
  if (new Date(challenge.expires_at).getTime() < Date.now()) {
    await pool.query("DELETE FROM login_two_factor_challenges WHERE id = ?", [challenge.id]);
    throw new AppError("INVALID_2FA_CHALLENGE", "Verification code expired", 400);
  }

  const matches = await bcrypt.compare(normalizedCode, challenge.code_hash);
  if (!matches) {
    throw new AppError("INVALID_2FA_CODE", "Invalid verification code", 400);
  }

  await pool.query("UPDATE login_two_factor_challenges SET consumed_at = NOW() WHERE id = ?", [challenge.id]);
  return { user_id: Number(challenge.user_id) };
};

const clearLoginTwoFactorChallenge = async (challengeToken) => {
  await ensureTwoFactorTables();
  const normalizedToken = String(challengeToken || "").trim();
  if (!normalizedToken) return;
  await pool.query("DELETE FROM login_two_factor_challenges WHERE challenge_token = ?", [normalizedToken]);
};

module.exports = {
  ensureTwoFactorTables,
  getTwoFactorEmailSettings,
  setTwoFactorEmailEnabled,
  createLoginTwoFactorChallenge,
  verifyLoginTwoFactorChallenge,
  clearLoginTwoFactorChallenge
};
