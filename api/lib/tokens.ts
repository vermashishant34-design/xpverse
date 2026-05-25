import jwt, { type SignOptions } from "jsonwebtoken";

function signToken(
  userId: string,
  secret: string | undefined,
  envExpires: string | undefined,
  fallback: SignOptions["expiresIn"]
) {
  if (!secret) throw new Error("JWT secret is not set");
  const options: SignOptions = {
    expiresIn: (envExpires || fallback) as SignOptions["expiresIn"],
  };
  return jwt.sign({ userId }, secret, options);
}

export function generateAccessToken(userId: string) {
  return signToken(userId, process.env.JWT_SECRET, process.env.JWT_ACCESS_EXPIRES_IN, "15m");
}

export function generateRefreshToken(userId: string) {
  return signToken(
    userId,
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRES_IN,
    "7d"
  );
}
