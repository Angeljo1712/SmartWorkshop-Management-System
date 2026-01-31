const jobService = require("../services/jobService");
const { pool } = require("../config/pool");
const { AppError } = require("../../frontend/src/utils/appError");
const { getWorkshopIdForMechanic } = require("../services/quotationService");

const getJobsMeHandler = async (req, res) => {
  if (req.user.role === "CUSTOMER") {
    const jobs = await jobService.getJobsForCustomer(req.user.userId);
    return res.json(jobs);
  }

  if (req.user.role === "MECHANIC") {
    const workshopId = await getWorkshopIdForMechanic(req.user.userId);
    if (!workshopId) {
      throw new AppError("WORKSHOP_REQUIRED", "Mechanic must belong to a workshop", 403);
    }
    const jobs = await jobService.getJobsForWorkshop(workshopId);
    return res.json(jobs);
  }

  const [rows] = await pool.query("SELECT * FROM jobs ORDER BY job_id DESC");
  return res.json(rows);
};

const updateJobStatusHandler = async (req, res) => {
  const { status, comment } = req.body;
  const updated = await jobService.updateJobStatus({
    jobId: Number(req.params.jobId),
    userId: req.user.userId,
    role: req.user.role,
    status,
    comment
  });
  res.json(updated);
};

const getJobHistoryHandler = async (req, res) => {
  const jobId = Number(req.params.jobId);
  const [rows] = await pool.query(
    `SELECT j.*, r.customer_id
     FROM jobs j
     JOIN service_requests r ON j.request_id = r.request_id
     WHERE j.job_id = ?`,
    [jobId]
  );
  const job = rows[0];
  if (!job) {
    throw new AppError("JOB_NOT_FOUND", "Job not found", 404);
  }

  if (req.user.role === "CUSTOMER" && job.customer_id !== req.user.userId) {
    throw new AppError("FORBIDDEN", "Access denied", 403);
  }

  if (req.user.role === "MECHANIC") {
    const workshopId = await getWorkshopIdForMechanic(req.user.userId);
    if (!workshopId || workshopId !== job.workshop_id) {
      throw new AppError("FORBIDDEN", "Access denied", 403);
    }
  }

  const history = await jobService.getJobHistory(jobId);
  res.json(history);
};

module.exports = { getJobsMeHandler, updateJobStatusHandler, getJobHistoryHandler };



