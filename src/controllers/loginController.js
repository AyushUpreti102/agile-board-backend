import { handleLogin, handleRegister } from "../services/loginService.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Controller handles request-level validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const result = await handleLogin({ email, password });
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }

  try {
    const result = await handleRegister({ name, email, password, avatar });
    return res.status(201).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};
