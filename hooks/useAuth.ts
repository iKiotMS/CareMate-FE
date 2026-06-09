import { create } from "zustand";
import Cookies from "js-cookie";

export interface User {
  _id: string;
  email?: string;
  fullName: string;
  role: "customer" | "cleaner" | "admin";
  avatarUrl?: string;
  phone: string;
  isActive: boolean;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: Cookies.get("accessToken") || null,
  isAuthenticated: !!Cookies.get("accessToken"),
  login: (user, accessToken, refreshToken) => {
    console.log(`[AUTH STORE] Storing tokens for user: ${user._id}`);
    Cookies.set("accessToken", accessToken);
    Cookies.set("refreshToken", refreshToken);
    console.log(`[AUTH STORE] Tokens stored in cookies`);
    set({ user, accessToken, isAuthenticated: true });
    console.log(`[AUTH STORE] Auth state updated`);
  },
  logout: () => {
    console.log(`[AUTH STORE] Logging out - clearing tokens`);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
  setUser: (user) => set({ user }),
}));
