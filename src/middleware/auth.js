import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({
      message: "Access token missing",
    });
  }

  const token = auth.split(" ")[1];

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "access_secret_key",
    );

    next();
  } catch {
    return res.status(401).json({
      message: "Access token expired",
    });
  }
};
