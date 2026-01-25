const app = require("./src/app");
const { env } = require("./src/config/env");
const { seedDatabase } = require("./src/db/seed");

const port = env.apiPort;

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
  if (env.seedOnStart) {
    seedDatabase();
  }
});
