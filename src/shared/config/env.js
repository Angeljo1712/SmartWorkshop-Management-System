const path = require("path");
const dotenv = require("dotenv");
const { validateEnv } = require("./validateEnv");

dotenv.config();

const env = {
  apiPort: process.env.API_PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "dev_jwt_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "5m",
  twoFactorReauthHours: Math.max(1, Number(process.env.TWO_FACTOR_REAUTH_HOURS || 24) || 24),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  dvla: {
    baseUrl: process.env.DVLA_BASE_URL || "https://uat.driver-vehicle-licensing.api.gov.uk/vehicle-enquiry",
    apiKey: process.env.DVLA_API_KEY || ""
  },
  dvsa: {
    baseUrl: process.env.DVSA_BASE_URL || "https://history.mot.api.gov.uk",
    tokenUrl: process.env.DVSA_TOKEN_URL || "",
    clientId: process.env.DVSA_CLIENT_ID || "",
    clientSecret: process.env.DVSA_CLIENT_SECRET || "",
    apiKey: process.env.DVSA_API_KEY || "",
    scope: process.env.DVSA_SCOPE || "https://tapi.dvsa.gov.uk/.default"
  },
  taxApi: {
    baseUrl: process.env.TAX_API_BASE_URL || process.env.HMRC_BASE_URL || "",
    tokenUrl: process.env.TAX_API_TOKEN_URL || process.env.HMRC_TOKEN_URL || "",
    clientId: process.env.TAX_API_CLIENT_ID || process.env.HMRC_CLIENT_ID || "",
    clientSecret: process.env.TAX_API_CLIENT_SECRET || process.env.HMRC_CLIENT_SECRET || "",
    scope: process.env.TAX_API_SCOPE || process.env.HMRC_VAT_SCOPE || "",
    verifyUrl: process.env.TAX_API_VERIFY_URL || ""
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || "smartworkshop",
    user: process.env.DB_USER || "smartworkshop",
    password: process.env.DB_PASSWORD || "smartworkshop_pass"
  },
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || ""
  },
  geoapify: {
    apiKey: process.env.GEOAPIFY_API_KEY || "",
    mapStyle: process.env.GEOAPIFY_MAP_STYLE || "osm-carto"
  },
  uploadsDir: process.env.UPLOADS_DIR || path.join(__dirname, "../../../storage/uploads"),
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
  seedOnStart: process.env.SEED_ON_START === "true"
};

validateEnv(env);

module.exports = { env };
