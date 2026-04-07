const path = require("path");
const express = require("express");
const webRouter = require("./web/routes/web.routes");
const healthRouter = require("./features/health/routes/health.routes");
const authRouter = require("./features/auth/routes/auth.routes");
const serviceRequestRouter = require("./features/service-requests/routes/service-requests.routes");
const quotationRouter = require("./features/quotations/routes/quotations.routes");
const jobRouter = require("./features/jobs/routes/jobs.routes");
const adminRouter = require("./features/admin/routes/admin.routes");
const usersRouter = require("./features/user/routes/users.routes");
const vehicleEnquiryRouter = require("./features/vehicle-enquiry/routes/vehicle-enquiry.routes");
const workshopsRouter = require("./features/workshops/routes/workshops.routes");
const bookingsRouter = require("./features/bookings/routes/bookings.routes");
const catalogRouter = require("./features/catalog/routes/catalog.routes");
const contactRouter = require("./features/contact/routes/contact.routes");
const invoicesRouter = require("./features/invoices/routes/invoice.routes");
const { errorHandler } = require("./shared/middleware/error");
const { cors } = require("./shared/middleware/cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);
app.use("/uploads", express.static(path.join(__dirname, "shared", "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "..", "public")));
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "pug");
app.use("/", webRouter);

app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/service-requests", serviceRequestRouter);
app.use("/api/quotations", quotationRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users", usersRouter);
app.use("/api/vehicle-enquiry", vehicleEnquiryRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/invoices", invoicesRouter);
app.use("/api/catalog", catalogRouter);
app.use("/api/contact", contactRouter);
app.use("/workshops", workshopsRouter);

app.use(errorHandler);

module.exports = app;


