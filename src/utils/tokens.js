import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret_key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "refresh_secret_key";

export const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    },
  );

  return accessToken;
};

export const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: "30d",
    },
  );

  return refreshToken;
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
