const invoiceService = require("../services/invoices.service");

const getBookingInvoiceHandler = async (req, res) => {
  const bookingId = Number(req.params.bookingId);
  const invoice = await invoiceService.getInvoiceForBooking({
    bookingId,
    userId: req.user?.userId,
    roles: req.user?.roles,
    role: req.user?.role
  });
  res.json(invoice);
};

module.exports = {
  getBookingInvoiceHandler
};
