import { create } from "zustand";
import { playerStore } from "@/store/player";
import { apiClient } from "@/lib/api-client";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

const ACCESS_TOKEN_KEY = "xpverse:access:v1";
const REFRESH_TOKEN_KEY = "xpverse:refresh:v1";
const AUTH_KEY = "xpverse:auth:v1";

function getStoredAuth() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}

export const useAuth = create<AuthState>((set, get) => {
  const storedAuth = getStoredAuth();

  return {
    isAuthenticated: !!storedAuth,
    user: storedAuth?.user || null,
    accessToken: typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null,
    refreshToken: typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null,
    loading: false,
    error: null,

    signup: async (email: string, password: string) => {
      set({ loading: true, error: null });
      try {
        const res = await apiClient.signup(email, password);
        localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
        localStorage.setItem(AUTH_KEY, JSON.stringify({ user: res.user }));
        
        playerStore.createUser(email);
        playerStore.set({ displayName: res.user.displayName || email.split('@')[0], created: true });
        
        set({
          isAuthenticated: true,
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          loading: false,
        });
      } catch (error) {
        set({ loading: false, error: (error as Error).message || "Signup failed" });
      }
    },

    login: async (email: string, password: string) => {
      set({ loading: true, error: null });
      try {
        const res = await apiClient.login(email, password);
        localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
        localStorage.setItem(AUTH_KEY, JSON.stringify({ user: res.user }));
        
        if (!playerStore.isEmailUnique(email)) {
          playerStore.switchUser(email);
        } else {
          playerStore.createUser(email);
          playerStore.set({ displayName: res.user.displayName || email.split('@')[0], created: true });
        }
        
        set({
          isAuthenticated: true,
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          loading: false,
        });
      } catch (error) {
        set({ loading: false, error: (error as Error).message || "Login failed" });
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
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(AUTH_KEY);
      playerStore.logout();
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
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
      } catch (e) {
        get().logout();
      }
    },

    clearError: () => set({ error: null }),
  };
});
