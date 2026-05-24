const API_BASE = "/api";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export interface SignupData {
  username: string;
  email?: string;
  password?: string;
}

export interface LoginData {
  username: string;
  password?: string;
}

export const authApi = {
  signup: async (data: SignupData) => {
    return apiRequest("/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  login: async (data: LoginData) => {
    return apiRequest("/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getUser: async () => {
    return apiRequest("/user");
  },
  updateUser: async (data: any) => {
    return apiRequest("/user", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
