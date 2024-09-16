import { create } from "zustand";

type Store = {
  ready: boolean;
  isReady: () => void;
};

export const useStore = create<Store>()((set) => ({
  ready: false,
  isReady: () => set({ ready: true }),
}));
