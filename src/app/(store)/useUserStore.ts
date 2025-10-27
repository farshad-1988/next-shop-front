import { create } from "zustand";
import { UserItemStore } from "../types/types";

export const useUserStore = create<UserItemStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
