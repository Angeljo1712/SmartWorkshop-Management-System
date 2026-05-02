const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { pool } = require("../src/shared/config/pool");
const app = require("../src/app");
const { request } = require("./smoke/shared");

const smokeRoot = path.join(__dirname, "smoke");
const originalPoolQuery = pool.query.bind(pool);

const collectSmokeModules = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((left, right) =>
    left.name.localeCompare(right.name)
  );
  const modules = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const indexPath = path.join(entryPath, "index.js");
      if (fs.existsSync(indexPath)) {
        modules.push(require(indexPath));
      }
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".js")) {
      modules.push(require(entryPath));
    }
  }

  return modules.sort((left, right) => {
    const leftOrder = Number(left?.order || 0);
    const rightOrder = Number(right?.order || 0);
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
    return String(left?.name || "").localeCompare(String(right?.name || ""));
  });
};

const run = async () => {
  const server = app.listen(0);
  try {
    const groups = collectSmokeModules(smokeRoot).filter((group) => group && group.name && Array.isArray(group.checks));

    for (const group of groups) {
      console.log(`Running ${group.name} smoke checks`);
      if (typeof group.before === "function") {
        await group.before({ pool, originalPoolQuery });
      }
      try {
        for (const check of group.checks) {
          const pathName = typeof check === "string" ? check : check.path;
          const response = await request(server, pathName);
          if (typeof check === "string") {
            assert.strictEqual(response.statusCode, 200, `Expected ${pathName} to return 200, got ${response.statusCode}`);
            continue;
          }
          if (typeof check.expectedStatus === "number") {
            assert.strictEqual(
              response.statusCode,
              check.expectedStatus,
              `Expected ${pathName} to return ${check.expectedStatus}, got ${response.statusCode}`
            );
            continue;
          }
          check.assert(response);
        }
      } finally {
        if (typeof group.after === "function") {
          await group.after({ pool, originalPoolQuery });
        }
      }
    }

    console.log("Smoke test passed");
  } finally {
    pool.query = originalPoolQuery;
    await new Promise((resolve) => server.close(resolve));
  }
};

run().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
