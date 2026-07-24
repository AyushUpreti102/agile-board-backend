import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  getUserByEmail,
  createUser,
} from "../repositories/loginRespository.js";
import AppError from "../utils/appError.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";
const SALT_ROUNDS = 10;

export const handleRegister = async (payload) => {
  const { name, email, password, avatar } = payload;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new AppError("Email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await createUser({
    name,
    email,
    passwordHash: hashedPassword,
    avatar: avatar || null,
  });

  return {
    message: "User registered successfully",
    user: newUser,
  };
};

export const handleLogin = async (payload) => {
  const { email, password } = payload;

  const user = await getUserByEmail(email);
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    JWT_SECRET,
    { expiresIn: "1h" },
  );

  return { message: "Login successful", token };
};
