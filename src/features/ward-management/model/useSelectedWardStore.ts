import { create } from 'zustand';
import { MOCK_WARDS } from './mockWards';

interface SelectedWardState {
  selectedWardId: string;
  selectWard: (wardId: string) => void;
}

export const useSelectedWardStore = create<SelectedWardState>(set => ({
  selectedWardId: MOCK_WARDS[0].id,
  selectWard: wardId => set({ selectedWardId: wardId }),
}));
