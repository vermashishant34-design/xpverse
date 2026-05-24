const API_BASE = "http://localhost:3001/api";

interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: any;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const apiClient = {
  async signup(username: string, email?: string, password?: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message || "Signup failed");
    return res.json();
  },

  async login(username: string, password?: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message || "Login failed");
    return res.json();
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const res = await fetch(`${API_BASE}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) throw new Error((await res.json()).message || "Refresh failed");
    return res.json();
  },

  async logout(refreshToken: string): Promise<void> {
    const res = await fetch(`${API_BASE}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) throw new Error((await res.json()).message || "Logout failed");
  },

  async getUser(accessToken: string): Promise<any> {
    const res = await fetch(`${API_BASE}/user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error((await res.json()).message || "Get user failed");
    return res.json();
  },

  async updateUser(accessToken: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message || "Update user failed");
    return res.json();
  },
};
