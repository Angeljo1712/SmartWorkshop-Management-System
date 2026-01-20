const path = require("path");
const express = require("express");
const healthRouter = require("./routes/health");

const app = express();

app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", {
    title: "SmartWorkshop Management System",
    message: "Backend API is running"
  });
});

app.use("/health", healthRouter);

module.exports = app;
