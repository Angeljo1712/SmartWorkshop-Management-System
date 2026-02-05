const bookingService = require("../services/bookingService");

const saveBookingDetailsHandler = async (req, res) => {
  const result = await bookingService.saveBookingDetails(req.body || {});
  res.status(200).json({ ok: true, customerId: result.customerId });
};

module.exports = { saveBookingDetailsHandler };
