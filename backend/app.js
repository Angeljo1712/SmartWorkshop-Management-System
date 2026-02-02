const path = require("path");
const express = require("express");
const healthRouter = require("./routes/health");
const authRouter = require("./routes/auth");
const serviceRequestRouter = require("./routes/serviceRequests");
const quotationRouter = require("./routes/quotations");
const jobRouter = require("./routes/jobs");
const adminRouter = require("./routes/admin");
const usersRouter = require("./routes/users");
const vehicleEnquiryRouter = require("./routes/vehicleEnquiry");
const workshopsRouter = require("./routes/workshops");
const { errorHandler } = require("./middleware/error");
const { cors } = require("./middleware/cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.set("views", path.join(__dirname, "../frontend/src/views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", {
    title: "SmartWorkshop Management System",
    message: "Backend API is running"
  });
});

app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/service-requests", serviceRequestRouter);
app.use("/api/quotations", quotationRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users", usersRouter);
app.use("/api/vehicle-enquiry", vehicleEnquiryRouter);
app.use("/workshops", workshopsRouter);

app.use(errorHandler);

module.exports = app;

