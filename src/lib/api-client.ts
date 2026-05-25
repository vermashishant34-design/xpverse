import { isAuthResponse, type AuthResponse } from "./auth-types";

/** Same-origin /api — Vite proxies to Express locally; Vercel runs serverless functions. */
const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
  } catch {
    throw new Error(
      import.meta.env.PROD
        ? "Cannot reach the server. Add MONGODB_URI and JWT secrets on Vercel, then redeploy."
        : "Cannot reach the server. Run: npm run dev:all"
    );
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      "Server returned an invalid response. Deploy the api/ folder to Vercel and set environment variables."
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export async function authRequest(endpoint: string, body: Record<string, unknown>): Promise<AuthResponse> {
  const data = await request<unknown>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!isAuthResponse(data)) {
    throw new Error("Invalid server response — account was not created. Check API deployment.");
  }

  return data;
}

export const apiClient = {
  signup: (email: string, password: string) =>
    authRequest("/auth/signup", { email, password }),

  login: (email: string, password: string) =>
    authRequest("/auth/login", { email, password }),

  refresh: (refreshToken: string) =>
    request<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  logout: (refreshToken: string) =>
    request<{ message: string }>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),
};
