module.exports = {
  order: 20,
  name: "DB-backed routes",
  before: async ({ pool, originalPoolQuery }) => {
    const homeFixtureRows = [
      {
        rating: 5,
        comment: "Great service and fast turnaround.",
        created_at: new Date("2026-04-23T10:00:00Z"),
        name: "Alex",
        lastname: "Taylor",
        avatar_url: "",
        make: "Ford",
        model: "Focus",
        year: 2018
      },
      {
        rating: 4,
        comment: "Clear pricing and good communication.",
        created_at: new Date("2026-04-23T11:00:00Z"),
        name: "Jamie",
        lastname: "Lee",
        avatar_url: "",
        make: "Vauxhall",
        model: "Astra",
        year: 2020
      }
    ];

    pool.query = async (sql, params) => {
      const text = String(sql || "");
      if (text.includes("FROM reviews r") && text.includes("ORDER BY RAND()")) {
        return [homeFixtureRows, []];
      }
      return originalPoolQuery(sql, params);
    };
  },
  after: async ({ pool, originalPoolQuery }) => {
    pool.query = originalPoolQuery;
  },
  checks: [
    {
      path: "/",
      assert: (response) => {
        const assert = require("assert");
        assert.strictEqual(response.statusCode, 200, `Expected / to return 200, got ${response.statusCode}`);
      }
    }
  ]
};
