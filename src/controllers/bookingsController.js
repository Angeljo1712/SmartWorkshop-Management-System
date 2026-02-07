const bookingService = require("../services/bookingService");

const saveBookingDetailsHandler = async (req, res) => {
  const result = await bookingService.saveBookingDetails(req.body || {});
  res.status(200).json({ ok: true, customerId: result.customerId });
};

const getDraftHandler = async (req, res) => {
  const sessionId = String(req.query.session_id || "").trim();
  const draft = await bookingService.getDraft(sessionId);
  res.json(draft);
};

const addDraftItemHandler = async (req, res) => {
  const payload = req.body || {};
  const result = await bookingService.addDraftItem(payload);
  res.status(200).json(result);
};

const removeDraftItemHandler = async (req, res) => {
  const sessionId = String(req.query.session_id || "").trim();
  const serviceId = Number(req.params.serviceId);
  const result = await bookingService.removeDraftItem({ sessionId, serviceId });
  res.status(200).json(result);
};

const payDraftHandler = async (req, res) => {
  const result = await bookingService.payDraft(req.body || {});
  res.status(200).json(result);
};

module.exports = {
  saveBookingDetailsHandler,
  getDraftHandler,
  addDraftItemHandler,
  removeDraftItemHandler,
  payDraftHandler
};
