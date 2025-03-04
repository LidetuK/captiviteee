import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (credentials) => {
        if (credentials.email && credentials.password) {
          set({ isAuthenticated: true, user: { email: credentials.email } });
        }
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
