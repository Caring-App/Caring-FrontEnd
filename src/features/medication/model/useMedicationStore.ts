import { create } from 'zustand';
import { updateMedicationStatus } from '../api'; // Spring Boot 서버 연동 API

export type MealSlot = 'morning' | 'lunch' | 'dinner';

interface MedicationState {
  taken: Record<MealSlot, boolean>;
  setTaken: (slot: MealSlot, value: boolean) => Promise<void>;
}

export const useMedicationStore = create<MedicationState>((set) => ({
  taken: { morning: false, lunch: false, dinner: false },

  setTaken: async (slot, value) => {
    // 1. 낙관적 업데이트: 서버 응답을 기다리지 않고 UI를 즉시 변경하여 반응 속도를 높임
    set((state) => ({
      taken: { ...state.taken, [slot]: value },
    }));

    try {
      // 2. Spring Boot 서버로 복약 상태 전송
      await updateMedicationStatus(slot, value);
    } catch (error) {
      // 3. 서버 전송 실패 시 에러 로그 출력 (필요시 원래 상태로 롤백 로직 추가 가능)
      console.error('서버 동기화 에러 발생:', error);
    }
  },
}));