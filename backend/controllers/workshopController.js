const { findNearbyWorkshops } = require("../services/workshopService");

const getNearbyWorkshopsHandler = async (req, res) => {
  const { postcode, radiusKm } = req.query;
  const payload = await findNearbyWorkshops({ postcode, radiusKm });
  res.json(payload);
};

module.exports = { getNearbyWorkshopsHandler };
