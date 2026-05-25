import { connectDB } from "./mongodb";
import type { AuthResult } from "./auth-service";

export type ApiRequest = {
  method?: string;
  body?: { email?: string; password?: string; refreshToken?: string };
};

export type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export function methodNotAllowed(res: ApiResponse) {
  return res.status(405).json({ message: "Method not allowed" });
}

export async function runAuthHandler(
  req: ApiRequest,
  res: ApiResponse,
  handler: () => Promise<AuthResult>
) {
  if (req.method !== "POST") {
    return methodNotAllowed(res);
  }

  try {
    await connectDB();
    const result = await handler();
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
        error.message.includes("connect")
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
