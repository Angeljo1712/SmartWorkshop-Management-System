const DEFAULT_PLACEHOLDERS = new Set([
  "replace_me",
  "replace_me_for_staging",
  "dev_jwt_secret"
]);

const isBlank = (value) => String(value || "").trim().length === 0;

const isPlaceholder = (value) => DEFAULT_PLACEHOLDERS.has(String(value || "").trim());

const validateEnv = (env) => {
  const mode = String(process.env.NODE_ENV || "development").toLowerCase();
  const strict =
    mode === "staging" ||
    mode === "production" ||
    String(process.env.STRICT_ENV_VALIDATION || "").toLowerCase() === "true";
  const softMode = mode === "development";
  const issues = [];

  const requiredFields = [
    ["JWT_SECRET", env.jwtSecret],
    ["DB_HOST", env.db?.host],
    ["DB_NAME", env.db?.name],
    ["DB_USER", env.db?.user],
    ["DB_PASSWORD", env.db?.password]
  ];

  for (const [name, value] of requiredFields) {
    if (isBlank(value)) {
      issues.push(`${name} is missing`);
    } else if (isPlaceholder(value)) {
      issues.push(`${name} uses a placeholder value`);
    }
  }

  const warn = (message) => {
    console.warn(`[env] ${message}`);
  };

  if (!issues.length) {
    return { strict, issues: [] };
  }

  if (strict) {
    const error = new Error(`Environment validation failed: ${issues.join("; ")}`);
    error.code = "INVALID_ENV";
    throw error;
  }

  if (!softMode) {
    console.warn(`[env] Running in non-production mode (${mode}) with warnings only`);
  }
  issues.forEach(warn);
  return { strict, issues };
};

module.exports = { validateEnv };
