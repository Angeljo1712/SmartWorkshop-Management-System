const path = require("path");
const express = require("express");
const { registerRoutes } = require("./routes/register");
const { errorHandler } = require("./shared/middleware/error");
const { cors } = require("./shared/middleware/cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);
app.use("/uploads", express.static(path.join(__dirname, "shared", "uploads")));
app.use(
  "/.well-known",
  express.static(path.join(__dirname, "..", "public", ".well-known"), {
    dotfiles: "allow"
  })
);
app.use(express.static(path.join(__dirname, "..", "public")));
app.get("/favicon.ico", (_req, res) => {
  res.status(204).end();
});
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "pug");
registerRoutes(app);

app.use(errorHandler);

module.exports = app;


