const app = require("./app");
const { env } = require("./config/env");

const port = env.apiPort;

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
