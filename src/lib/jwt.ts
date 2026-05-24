import jwt from "jsonwebtoken";
import "dotenv/config";

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must be set in .env");
}

const ACCESS_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export interface JWTPayload {
  userId: string;
  username: string;
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES as jwt.SignOptions["expiresIn"] });
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES as jwt.SignOptions["expiresIn"] });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, ACCESS_SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, REFRESH_SECRET) as JWTPayload;
}
