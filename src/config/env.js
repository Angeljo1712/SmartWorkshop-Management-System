const dotenv = require("dotenv");

dotenv.config();

const env = {
  apiPort: process.env.API_PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "dev_jwt_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
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
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
  seedOnStart: process.env.SEED_ON_START === "true"
};

module.exports = { env };
