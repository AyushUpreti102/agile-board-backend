import pool from "../config/db.js";
import AppError from "../utils/appError.js";

export const getUserByEmail = async (email) => {
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (err) {
    throw new AppError("Database server error during user lookup.", 500);
  }
};

export const createUser = async ({ name, email, passwordHash, avatar }) => {
  try {
    const query = `
      INSERT INTO users (name, email, password, avatar) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, name, email, avatar, created_at
    `;
    const values = [name, email, passwordHash, avatar];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    // Unique violation constraint code
    if (err.code === "23505") {
      throw new AppError("Email already exists", 400);
    }
    throw new AppError("Database server error during user creation.", 500);
  }
};
