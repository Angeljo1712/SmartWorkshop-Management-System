const { pool } = require("../config/pool");
const { AppError } = require("../utils/appError");

const getWorkshopIdForMechanic = async (mechanicId) => {
  const [rows] = await pool.query(
    "SELECT workshop_id FROM workshop_members WHERE user_id = ?",
    [mechanicId]
  );
  return rows[0] ? rows[0].workshop_id : null;
};

const createQuotation = async (mechanicId, payload) => {
  const { request_id, labour_cost, parts_cost, estimated_days, notes } = payload;
  if (!request_id || labour_cost === undefined || parts_cost === undefined || !estimated_days) {
    throw new AppError("VALIDATION_ERROR", "request_id, labour_cost, parts_cost, estimated_days are required", 400);
  }
  if (Number.isNaN(Number(labour_cost)) || Number.isNaN(Number(parts_cost)) || Number.isNaN(Number(estimated_days))) {
    throw new AppError("VALIDATION_ERROR", "labour_cost, parts_cost, estimated_days must be numeric", 400);
  }

  const workshopId = await getWorkshopIdForMechanic(mechanicId);
  if (!workshopId) {
    throw new AppError("WORKSHOP_REQUIRED", "Mechanic must belong to a workshop", 403);
  }

  const [requestRows] = await pool.query(
    "SELECT request_id, status FROM service_requests WHERE request_id = ?",
    [request_id]
  );
  const request = requestRows[0];
  if (!request) {
    throw new AppError("REQUEST_NOT_FOUND", "Service request not found", 404);
  }

  if (!['Submitted', 'Quoted'].includes(request.status)) {
    throw new AppError("REQUEST_NOT_OPEN", "Service request is not open for quotations", 400);
  }

  const total_cost = Number(labour_cost) + Number(parts_cost);

  const [result] = await pool.query(
    `INSERT INTO quotations
     (request_id, workshop_id, mechanic_id, labour_cost, parts_cost, total_cost, estimated_days, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Submitted')`,
    [request_id, workshopId, mechanicId, labour_cost, parts_cost, total_cost, estimated_days, notes || null]
  );

  await pool.query(
    "UPDATE service_requests SET status = 'Quoted' WHERE request_id = ? AND status = 'Submitted'",
    [request_id]
  );

  const [rows] = await pool.query("SELECT * FROM quotations WHERE quotation_id = ?", [result.insertId]);
  return rows[0];
};

const getQuotationsForRequest = async (requestId) => {
  const [rows] = await pool.query(
    `SELECT q.*, w.name AS workshop_name, u.full_name AS mechanic_name
     FROM quotations q
     JOIN workshops w ON q.workshop_id = w.workshop_id
     JOIN users u ON q.mechanic_id = u.user_id
     WHERE q.request_id = ?
     ORDER BY q.created_at ASC`,
    [requestId]
  );
  return rows;
};

const acceptQuotation = async (quotationId, customerId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT q.quotation_id, q.request_id, q.workshop_id, q.mechanic_id, q.status AS quotation_status,
              r.customer_id, r.status AS request_status
       FROM quotations q
       JOIN service_requests r ON q.request_id = r.request_id
       WHERE q.quotation_id = ?
       FOR UPDATE`,
      [quotationId]
    );

    const record = rows[0];
    if (!record) {
      throw new AppError("QUOTATION_NOT_FOUND", "Quotation not found", 404);
    }
    if (record.customer_id !== customerId) {
      throw new AppError("FORBIDDEN", "Quotation does not belong to your request", 403);
    }
    if (record.quotation_status !== "Submitted") {
      throw new AppError("QUOTATION_NOT_OPEN", "Quotation cannot be accepted", 400);
    }
    if (record.request_status === "Accepted" || record.request_status === "Closed") {
      throw new AppError("REQUEST_ALREADY_ACCEPTED", "Request already accepted", 400);
    }

    await connection.query(
      "UPDATE quotations SET status = 'Accepted' WHERE quotation_id = ?",
      [quotationId]
    );
    await connection.query(
      "UPDATE quotations SET status = 'Rejected' WHERE request_id = ? AND quotation_id <> ? AND status = 'Submitted'",
      [record.request_id, quotationId]
    );
    await connection.query(
      "UPDATE service_requests SET status = 'Accepted' WHERE request_id = ?",
      [record.request_id]
    );

    const [jobResult] = await connection.query(
      `INSERT INTO jobs (request_id, quotation_id, workshop_id, assigned_mechanic_id, status)
       VALUES (?, ?, ?, ?, 'Accepted')`,
      [record.request_id, record.quotation_id, record.workshop_id, record.mechanic_id]
    );

    await connection.query(
      `INSERT INTO job_status_history (job_id, status, updated_by, comment)
       VALUES (?, 'Accepted', ?, 'Job created from accepted quotation')`,
      [jobResult.insertId, customerId]
    );

    await connection.commit();
    return { job_id: jobResult.insertId };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

module.exports = {
  createQuotation,
  getQuotationsForRequest,
  acceptQuotation,
  getWorkshopIdForMechanic
};



