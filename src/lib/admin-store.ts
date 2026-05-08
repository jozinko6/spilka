import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminStore {
  isAuthenticated: boolean;
  token: string | null;
  _hasHydrated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      _hasHydrated: false,
      login: async (username: string, password: string) => {
        try {
          const res = await fetch("/api/admin/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });
          const data = await res.json();
          if (data.success && data.token) {
            set({ isAuthenticated: true, token: data.token });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
      logout: () => {
        set({ isAuthenticated: false, token: null });
      },
      setHasHydrated: (value: boolean) => {
        set({ _hasHydrated: value });
      },
    }),
    {
      name: "spilka-admin-auth",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
