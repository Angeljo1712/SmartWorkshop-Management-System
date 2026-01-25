const { env } = require("../config/env");

const cors = (req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || env.corsOrigin === "*") {
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else if (env.corsOrigin.split(",").map((item) => item.trim()).includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
};

module.exports = { cors };
