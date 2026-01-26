const { AppError } = require("../frontend/src/utils/appError");

const errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }

  console.error(err);
  return res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Unexpected error" } });
};

module.exports = { errorHandler };


