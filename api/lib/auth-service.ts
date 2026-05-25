import jwt from "jsonwebtoken";
import User from "./User";
import { findUserByLoginId, getAccountEmail, normalizeLoginId } from "./find-user";
import { generateAccessToken, generateRefreshToken } from "./tokens";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function userPayload(user: InstanceType<typeof User>) {
  const email = getAccountEmail(user);
  return {
    id: user._id,
    email,
    displayName: user.displayName || email.split("@")[0],
  };
}

export type AuthResult =
  | { ok: true; status: number; body: Record<string, unknown> }
  | { ok: false; status: number; body: { message: string } };

export async function signupUser(email?: string, password?: string): Promise<AuthResult> {
  if (!email || !password) {
    return { ok: false, status: 400, body: { message: "Email and password are required" } };
  }

  const normalizedEmail = normalizeLoginId(email);
  if (!isValidEmail(normalizedEmail)) {
    return { ok: false, status: 400, body: { message: "Please sign up with a valid email address" } };
  }

  const emailTaken = await User.exists({ email: normalizedEmail });
  if (emailTaken) {
    return { ok: false, status: 400, body: { message: "An account with this email already exists" } };
  }

  const user = new User({
    email: normalizedEmail,
    password,
    displayName: normalizedEmail.split("@")[0],
  });

  try {
    await user.save();
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("E11000")) {
      return {
        ok: false,
        status: 400,
        body: {
          message:
            "Could not create account (database index conflict). Try again in a minute or contact support.",
        },
      };
    }
    throw err;
  }

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  return {
    ok: true,
    status: 201,
    body: {
      message: "User created successfully",
      user: userPayload(user),
      accessToken,
      refreshToken,
    },
  };
}

export async function loginUser(email?: string, password?: string): Promise<AuthResult> {
  if (!email || !password) {
    return { ok: false, status: 400, body: { message: "Email and password are required" } };
  }

  const loginId = normalizeLoginId(email);
  const user = await findUserByLoginId(loginId);
  if (!user) {
    return { ok: false, status: 401, body: { message: "Invalid credentials" } };
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return { ok: false, status: 401, body: { message: "Invalid credentials" } };
  }

  if (!user.email && loginId.includes("@")) {
    user.email = loginId;
    user.displayName = user.displayName || loginId.split("@")[0];
    await user.save();
  }

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  return {
    ok: true,
    status: 200,
    body: {
      message: "Login successful",
      user: userPayload(user),
      accessToken,
      refreshToken,
    },
  };
}

export async function refreshTokens(refreshToken?: string): Promise<AuthResult> {
  if (!refreshToken) {
    return { ok: false, status: 400, body: { message: "Refresh token is required" } };
  }

  try {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT_REFRESH_SECRET is not set");

    const decoded = jwt.verify(refreshToken, secret) as { userId: string };
    const accessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    return {
      ok: true,
      status: 200,
      body: { accessToken, refreshToken: newRefreshToken },
    };
  } catch {
    return { ok: false, status: 401, body: { message: "Invalid refresh token" } };
  }
}

export function logoutUser(): AuthResult {
  return { ok: true, status: 200, body: { message: "Logged out successfully" } };
}
