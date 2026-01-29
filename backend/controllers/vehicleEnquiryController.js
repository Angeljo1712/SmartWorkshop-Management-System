const { enquireVehicle } = require("../services/vehicleEnquiryService");

const vehicleEnquiryHandler = async (req, res) => {
  const { registrationNumber } = req.body || {};
  const result = await enquireVehicle(registrationNumber);
  res.json(result);
};

module.exports = { vehicleEnquiryHandler };
