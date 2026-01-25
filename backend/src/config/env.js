const dotenv = require("dotenv");

dotenv.config();

const env = {
  apiPort: process.env.API_PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "dev_jwt_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || "smartworkshop",
    user: process.env.DB_USER || "smartworkshop",
    password: process.env.DB_PASSWORD || "smartworkshop_pass"
  },
  seedOnStart: process.env.SEED_ON_START === "true"
};

module.exports = { env };
