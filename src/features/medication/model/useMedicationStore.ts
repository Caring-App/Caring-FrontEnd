import { create } from 'zustand';
import { MOCK_WARDS } from '@features/ward-management/model';

export type MealSlot = 'morning' | 'lunch' | 'dinner';
export type MedicationTaken = Record<MealSlot, boolean>;

interface MedicationState {
  // TODO: 실서비스에서는 돌봄대상자 앱 → 서버 → 보호자 앱으로 동기화되는 값으로 교체 필요
  takenByWard: Record<string, MedicationTaken>;
  setTaken: (wardId: string, slot: MealSlot, value: boolean) => void;
}

// TODO: 백엔드 연동 전 mock 데이터, 어르신별로 다른 값임을 보여주기 위한 임시 시드
const MOCK_TAKEN_BY_WARD: Record<string, MedicationTaken> = {
  [MOCK_WARDS[0].id]: { morning: true, lunch: true, dinner: false },
  [MOCK_WARDS[1].id]: { morning: true, lunch: false, dinner: false },
};

export const useMedicationStore = create<MedicationState>(set => ({
  takenByWard: MOCK_TAKEN_BY_WARD,
  setTaken: (wardId, slot, value) =>
    set(state => ({
      takenByWard: {
        ...state.takenByWard,
        [wardId]: { ...state.takenByWard[wardId], [slot]: value },
      },
    })),
}));
