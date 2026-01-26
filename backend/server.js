const app = require("./app");
const { env } = require("./config/env");
const { seedDatabase } = require("./db/seed");

const port = env.apiPort;

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
  if (env.seedOnStart) {
    seedDatabase();
  }
});

