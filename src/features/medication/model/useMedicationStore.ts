import { create } from 'zustand';

export type MealSlot = 'morning' | 'lunch' | 'dinner';

interface MedicationState {
  // TODO: 실서비스에서는 돌봄대상자 앱 → 서버 → 보호자 앱으로 동기화되는 값으로 교체 필요
  taken: Record<MealSlot, boolean>;
  setTaken: (slot: MealSlot, value: boolean) => void;
}

export const useMedicationStore = create<MedicationState>(set => ({
  taken: { morning: false, lunch: false, dinner: false },
  setTaken: (slot, value) =>
    set(state => ({ taken: { ...state.taken, [slot]: value } })),
}));
