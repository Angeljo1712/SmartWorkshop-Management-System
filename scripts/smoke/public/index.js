module.exports = {
  order: 10,
  name: "Public routes",
  checks: [
    {
      path: "/health",
      assert: (response) => {
        const assert = require("assert");
        assert.strictEqual(response.statusCode, 200, `Expected /health to return 200, got ${response.statusCode}`);
        let payload;
        try {
          payload = JSON.parse(response.body);
        } catch (_error) {
          throw new Error(`Expected /health to return JSON, got: ${response.body}`);
        }
        assert.strictEqual(payload.status, "ok", "Expected /health response to include { status: 'ok' }");
      }
    },
    "/auth",
    "/auth/login",
    "/bookings",
    "/bookings/vehicle",
    "/application",
    "/admin/dashboard",
    "/user/dashboard",
    "/mechanic/dashboard"
  ]
};
