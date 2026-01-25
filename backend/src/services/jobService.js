const { pool } = require("../config/pool");
const { AppError } = require("../utils/appError");
const { getWorkshopIdForMechanic } = require("./quotationService");

const getJobsForCustomer = async (customerId) => {
  const [rows] = await pool.query(
    `SELECT j.*, r.vehicle_reg, r.vehicle_make, r.vehicle_model
     FROM jobs j
     JOIN service_requests r ON j.request_id = r.request_id
     WHERE r.customer_id = ?
     ORDER BY j.job_id DESC`,
    [customerId]
  );
  return rows;
};

const getJobsForWorkshop = async (workshopId) => {
  const [rows] = await pool.query(
    "SELECT * FROM jobs WHERE workshop_id = ? ORDER BY job_id DESC",
    [workshopId]
  );
  return rows;
};

const getJobById = async (jobId) => {
  const [rows] = await pool.query("SELECT * FROM jobs WHERE job_id = ?", [jobId]);
  return rows[0];
};

const updateJobStatus = async ({ jobId, userId, role, status, comment }) => {
  if (!status) {
    throw new AppError("VALIDATION_ERROR", "status is required", 400);
  }
  const allowedTransitions = {
    Accepted: "InProgress",
    InProgress: "Completed"
  };

  const job = await getJobById(jobId);
  if (!job) {
    throw new AppError("JOB_NOT_FOUND", "Job not found", 404);
  }

  if (role === "MECHANIC") {
    const workshopId = await getWorkshopIdForMechanic(userId);
    if (!workshopId || workshopId !== job.workshop_id) {
      throw new AppError("FORBIDDEN", "Job does not belong to your workshop", 403);
    }
    if (job.assigned_mechanic_id !== userId) {
      throw new AppError("FORBIDDEN", "Job is not assigned to you", 403);
    }
  }

  const expectedNext = allowedTransitions[job.status];
  if (!expectedNext || expectedNext !== status) {
    throw new AppError("STATUS_INVALID", `Invalid status transition from ${job.status} to ${status}`, 400);
  }

  const updates = { status };
  if (status === "InProgress") {
    updates.started_at = new Date();
  }
  if (status === "Completed") {
    updates.completed_at = new Date();
  }

  await pool.query(
    "UPDATE jobs SET status = ?, started_at = COALESCE(?, started_at), completed_at = COALESCE(?, completed_at) WHERE job_id = ?",
    [
      updates.status,
      updates.started_at ? new Date(updates.started_at).toISOString().slice(0, 19).replace('T', ' ') : null,
      updates.completed_at ? new Date(updates.completed_at).toISOString().slice(0, 19).replace('T', ' ') : null,
      jobId
    ]
  );

  await pool.query(
    "INSERT INTO job_status_history (job_id, status, updated_by, comment) VALUES (?, ?, ?, ?)",
    [jobId, status, userId, comment || null]
  );

  return getJobById(jobId);
};

const getJobHistory = async (jobId) => {
  const [rows] = await pool.query(
    `SELECT h.*, u.full_name AS updated_by_name
     FROM job_status_history h
     JOIN users u ON h.updated_by = u.user_id
     WHERE h.job_id = ?
     ORDER BY h.updated_at ASC`,
    [jobId]
  );
  return rows;
};

module.exports = {
  getJobsForCustomer,
  getJobsForWorkshop,
  getJobById,
  updateJobStatus,
  getJobHistory
};
