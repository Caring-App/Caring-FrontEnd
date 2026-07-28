import { create } from 'zustand';
import { UserRole } from '@shared/types';

interface SessionState {
  isLoggedIn: boolean;
  role: UserRole | null;
  linkedCode: string | null;
  isLogoutConfirmVisible: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  setLinkedCode: (code: string) => void;
  requestLogout: () => void;
  cancelLogout: () => void;
}

export const useSessionStore = create<SessionState>(set => ({
  isLoggedIn: false,
  role: null,
  linkedCode: null,
  isLogoutConfirmVisible: false,
  login: role => set({ isLoggedIn: true, role }),
  logout: () => set({ isLoggedIn: false, role: null, linkedCode: null, isLogoutConfirmVisible: false }),
  setLinkedCode: linkedCode => set({ linkedCode }),
  requestLogout: () => set({ isLogoutConfirmVisible: true }),
  cancelLogout: () => set({ isLogoutConfirmVisible: false }),
}));
