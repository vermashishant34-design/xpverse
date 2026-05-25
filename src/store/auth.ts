import { create } from "zustand";
import { playerStore } from "@/store/player";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password?: string) => Promise<void>;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

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
    loading: false,
    error: null,

    signup: async (email: string, password?: string) => {
      set({ loading: true, error: null });
      try {
        playerStore.createUser(email);
        playerStore.set({ created: true });
        
        const userData = { email };
        localStorage.setItem(AUTH_KEY, JSON.stringify({ user: userData }));
        
        set({
          isAuthenticated: true,
          user: userData,
          loading: false,
        });
      } catch (error) {
        set({ loading: false, error: (error as Error).message || "Signup failed" });
      }
    },

    login: async (email: string, password?: string) => {
      set({ loading: true, error: null });
      try {
        if (!playerStore.isEmailUnique(email)) {
          playerStore.switchUser(email);
        } else {
          playerStore.createUser(email);
          playerStore.set({ created: true });
        }
        
        const userData = { email };
        localStorage.setItem(AUTH_KEY, JSON.stringify({ user: userData }));
        
        set({
          isAuthenticated: true,
          user: userData,
          loading: false,
        });
      } catch (error) {
        set({ loading: false, error: (error as Error).message || "Login failed" });
      }
    },

    logout: () => {
      localStorage.removeItem(AUTH_KEY);
      playerStore.logout();
      set({
        isAuthenticated: false,
        user: null,
      });
    },

    clearError: () => set({ error: null }),
  };
});
