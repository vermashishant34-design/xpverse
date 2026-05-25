import { create } from "zustand";
import { playerStore } from "@/store/player";
import { apiClient } from "@/lib/api-client";
import { isValidEmail } from "@/lib/auth-types";

interface AuthState {
  isAuthenticated: boolean;
  user: { id?: string; email: string; displayName?: string } | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

const ACCESS_TOKEN_KEY = "xpverse:access:v1";
const REFRESH_TOKEN_KEY = "xpverse:refresh:v1";
const AUTH_KEY = "xpverse:auth:v1";

function hasStoredSession(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const authRaw = localStorage.getItem(AUTH_KEY);
  if (!token || token.length < 10 || !authRaw) return false;
  try {
    const auth = JSON.parse(authRaw);
    return Boolean(auth?.user?.email && String(auth.user.email).includes("@"));
  } catch {
    return false;
  }
}

function getStoredAuth() {
  if (!hasStoredSession()) return null;
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)!);
  } catch {
    return null;
  }
}

function persistSession(res: {
  user: { id?: string; email: string; displayName?: string };
  accessToken: string;
  refreshToken: string;
}) {
  localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
  localStorage.setItem(AUTH_KEY, JSON.stringify({ user: res.user }));
}

function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_KEY);
}

export const useAuth = create<AuthState>((set, get) => {
  const storedAuth = getStoredAuth();

  return {
    isAuthenticated: hasStoredSession(),
    user: storedAuth?.user || null,
    accessToken: typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null,
    refreshToken: typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null,
    loading: false,
    error: null,

    signup: async (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();

      if (!isValidEmail(normalizedEmail)) {
        set({ error: "Enter a valid email address (e.g. you@gmail.com)" });
        return false;
      }
      if (password.length < 6) {
        set({ error: "Password must be at least 6 characters" });
        return false;
      }

      set({ loading: true, error: null });
      try {
        const res = await apiClient.signup(normalizedEmail, password);
        persistSession(res);

        playerStore.createUser(normalizedEmail);
        playerStore.set({
          displayName: res.user.displayName || normalizedEmail.split("@")[0],
          created: true,
        });

        set({
          isAuthenticated: true,
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          loading: false,
          error: null,
        });
        return true;
      } catch (error) {
        set({ loading: false, error: (error as Error).message || "Signup failed" });
        return false;
      }
    },

    login: async (email: string, password: string) => {
      const loginId = email.trim().toLowerCase();

      if (!loginId || password.length < 1) {
        set({ error: "Email and password are required" });
        return false;
      }

      set({ loading: true, error: null });
      try {
        const res = await apiClient.login(loginId, password);
        persistSession(res);

        if (!playerStore.isEmailUnique(loginId)) {
          playerStore.switchUser(loginId);
        } else {
          playerStore.createUser(loginId);
          playerStore.set({
            displayName: res.user.displayName || loginId.split("@")[0],
            created: true,
          });
        }

        set({
          isAuthenticated: true,
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          loading: false,
          error: null,
        });
        return true;
      } catch (error) {
        set({ loading: false, error: (error as Error).message || "Login failed" });
        return false;
      }
    },

    logout: async () => {
      const { refreshToken } = get();
      if (refreshToken) {
        try {
          await apiClient.logout(refreshToken);
        } catch (e) {
          console.error("Logout error:", e);
        }
      }
      clearSession();
      playerStore.logout();
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        error: null,
      });
    },

    refresh: async () => {
      const { refreshToken } = get();
      if (!refreshToken) {
        get().logout();
        return;
      }
      try {
        const res = await apiClient.refresh(refreshToken);
        localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
        set({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        });
      } catch {
        get().logout();
      }
    },

    clearError: () => set({ error: null }),
  };
});
