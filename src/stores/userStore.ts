import { create } from "zustand";

interface User {
  username: string;
  email?: string;
  fullName?: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,

  setUser: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },

  clearUser: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
