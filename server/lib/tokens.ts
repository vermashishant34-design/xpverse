import jwt from "jsonwebtoken";

export function generateAccessToken(userId: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return jwt.sign({ userId }, secret, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });
}

export function generateRefreshToken(userId: string) {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("JWT_REFRESH_SECRET is not set");
  return jwt.sign({ userId }, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
}
