import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const userStore = create(
  persist(
    (set) => ({
      user: null,

      setUser: (userData) => set({ user: userData }),

      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default userStore;