const catalogService = require("../services/catalogService");

const listServicesHandler = async (req, res) => {
  const category = String(req.query.category || "").trim().toLowerCase();
  const region = String(req.query.region || "UK-default").trim();
  const services = await catalogService.listServices({ category, region });
  res.json(services);
};

module.exports = { listServicesHandler };
