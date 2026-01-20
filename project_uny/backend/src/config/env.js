const dotenv = require("dotenv");

dotenv.config();

const env = {
  apiPort: process.env.API_PORT || 3000,
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || "smartworkshop",
    user: process.env.DB_USER || "smartworkshop",
    password: process.env.DB_PASSWORD || "smartworkshop_pass"
  }
};

module.exports = { env };
