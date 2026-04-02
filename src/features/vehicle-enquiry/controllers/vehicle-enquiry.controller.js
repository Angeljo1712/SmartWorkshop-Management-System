const { enquireVehicle } = require("../services/vehicle-enquiry.service");

const vehicleEnquiryHandler = async (req, res) => {
  const { registrationNumber } = req.body || {};
  const result = await enquireVehicle(registrationNumber);
  res.json(result);
};

module.exports = { vehicleEnquiryHandler };
