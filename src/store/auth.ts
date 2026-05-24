import { create } from "zustand";
import { apiClient } from "@/lib/api-client";
import { playerStore } from "@/store/player";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  signup: (username: string, email?: string, password?: string) => Promise<void>;
  login: (username: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

const ACCESS_TOKEN_KEY = "xpverse:access:v1";
const REFRESH_TOKEN_KEY = "xpverse:refresh:v1";

export const useAuth = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  accessToken: typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null,
  loading: false,
  error: null,

  signup: async (username: string, email?: string, password?: string) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.signup(username, email, password);
      localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
      
      playerStore.createUser(username);
      playerStore.set({ username, created: true });
      
      set({
        isAuthenticated: true,
        user: res.user,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        loading: false,
      });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
    }
  },

  login: async (username: string, password?: string) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.login(username, password);
      localStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
      
      if (!playerStore.isUsernameUnique(username)) {
        playerStore.switchUser(username);
      } else {
        playerStore.createUser(username);
        playerStore.set({ username, created: true });
      }
      
      set({
        isAuthenticated: true,
        user: res.user,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        loading: false,
      });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
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
}));
