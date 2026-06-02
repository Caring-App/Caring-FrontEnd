import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  userRole: 'PROTECTOR' | 'WARD' | null;
  login: (role: 'PROTECTOR' | 'WARD') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userRole: null,
  login: (role) => set({ isLoggedIn: true, userRole: role }),
  logout: () => set({ isLoggedIn: false, userRole: null }),
}));