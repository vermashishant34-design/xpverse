import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "./mongodb";
import type { AuthResult } from "./auth-service";

export function methodNotAllowed(res: VercelResponse) {
  return res.status(405).json({ message: "Method not allowed" });
}

export async function runAuthHandler(
  req: VercelRequest,
  res: VercelResponse,
  handler: (body: VercelRequest["body"]) => Promise<AuthResult>
) {
  if (req.method !== "POST") {
    return methodNotAllowed(res);
  }

  const body = req.body as { email?: string; password?: string; refreshToken?: string } | undefined;

  try {
    await connectDB();
    const result = await handler(body);
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Auth API error:", error);
    let message = "Internal server error";
    let status = 500;

    if (error instanceof Error) {
      if (error.message.includes("is not set")) {
        message = "Server configuration error. Check environment variables on Vercel.";
      } else if (
        error.message.includes("MONGODB") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("MongoServerError") ||
        error.message.includes("connect") ||
        error.message.includes("Server selection")
      ) {
        message =
          "Cannot connect to MongoDB. Allow 0.0.0.0/0 in Atlas Network Access and verify MONGODB_URI.";
        status = 503;
      } else if (error.message.includes("E11000")) {
        message = "User already exists with this email";
        status = 400;
      }
    }

    return res.status(status).json({ message });
  }
}
