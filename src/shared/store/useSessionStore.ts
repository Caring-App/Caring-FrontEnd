import { create } from 'zustand';
import { UserRole } from '@shared/types';

interface SessionState {
  isLoggedIn: boolean;
  role: UserRole | null;
  linkedCode: string | null;
  login: (role: UserRole) => void;
  logout: () => void;
  setLinkedCode: (code: string) => void;
}

export const useSessionStore = create<SessionState>(set => ({
  isLoggedIn: false,
  role: null,
  linkedCode: null,
  login: role => set({ isLoggedIn: true, role }),
  logout: () => set({ isLoggedIn: false, role: null, linkedCode: null }),
  setLinkedCode: linkedCode => set({ linkedCode }),
}));
