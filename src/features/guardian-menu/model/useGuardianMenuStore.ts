import { create } from 'zustand';

interface GuardianMenuState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useGuardianMenuStore = create<GuardianMenuState>(set => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
