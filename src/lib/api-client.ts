const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

export const apiClient = {
  signup: (email: string, password: string) =>
    request<{
      user: { id: string; email: string; displayName?: string };
      accessToken: string;
      refreshToken: string;
    }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    request<{
      user: { id: string; email: string; displayName?: string };
      accessToken: string;
      refreshToken: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

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
