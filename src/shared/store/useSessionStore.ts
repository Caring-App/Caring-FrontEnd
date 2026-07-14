import { create } from 'zustand';
import { UserRole } from '@shared/types';

interface SessionState {
  role: UserRole | null;
  linkedCode: string | null;
  setRole: (role: UserRole) => void;
  setLinkedCode: (code: string) => void;
  clear: () => void;
}

export const useSessionStore = create<SessionState>(set => ({
  role: null,
  linkedCode: null,
  setRole: role => set({ role }),
  setLinkedCode: linkedCode => set({ linkedCode }),
  clear: () => set({ role: null, linkedCode: null }),
}));
