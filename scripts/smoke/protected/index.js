module.exports = {
  order: 30,
  name: "Protected routes",
  checks: [
    {
      path: "/api/users/me",
      expectedStatus: 401
    },
    {
      path: "/api/admin/workshops",
      expectedStatus: 401
    }
  ]
};
