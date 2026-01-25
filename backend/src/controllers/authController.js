const { register, login } = require("../services/authService");

const registerHandler = async (req, res) => {
  const result = await register(req.body);
  res.status(201).json(result);
};

const loginHandler = async (req, res) => {
  const result = await login(req.body);
  res.json(result);
};

module.exports = { registerHandler, loginHandler };
