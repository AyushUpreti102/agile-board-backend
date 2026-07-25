import bcrypt from "bcrypt";
import {
  getUserByEmail,
  createUser,
  getRefreshToken,
  saveRefreshToken,
  deleteRefreshToken,
} from "../repositories/loginRespository.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../utils/tokens.js";
import AppError from "../utils/appError.js";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret_key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "refresh_secret_key";
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

  const accessToken = generateAccessToken(user);

  const refreshToken = generateAccessToken(user);

  const tokenHash = hashToken(refreshToken);

  await saveRefreshToken(
    user.id,
    tokenHash,
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  );

  return {
    message: "Login successful",
    accessToken,
    refreshToken,
  };
};

export const handleRefresh = async ({ refreshToken }) => {
  if (!refreshToken) throw new AppError("Refresh token missing", 401);

  let payload;

  try {
    payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  const tokenHash = hashToken(refreshToken);

  const saved = await getRefreshToken(tokenHash);

  if (!saved) throw new AppError("Refresh token revoked", 401);

  await deleteRefreshToken(tokenHash);

  const newAccessToken = generateAccessToken(payload);

  const newRefreshToken = generateRefreshToken(payload);

  const newHash = hashToken(newRefreshToken);

  await saveRefreshToken(
    payload.id,
    newHash,
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const handleLogout = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  const hash = hashToken(refreshToken);

  await deleteRefreshToken(hash);

  return {
    message: "Logged out successfully",
  };
};
