import { create } from 'zustand';
import { updateMedicationStatus } from '../api'; // 방금 만든 API 함수 임포트

export type MealSlot = 'morning' | 'lunch' | 'dinner';

interface MedicationState {
  taken: Record<MealSlot, boolean>;
  setTaken: (slot: MealSlot, value: boolean) => Promise<void>; // 비동기로 변경
}

export const useMedicationStore = create<MedicationState>((set, get) => ({
  taken: { morning: false, lunch: false, dinner: false },
  
  setTaken: async (slot, value) => {
    // 1. 낙관적 업데이트 (UI를 먼저 즉시 변경)
    set((state) => ({ taken: { ...state.taken, [slot]: value } }));

    try {
      // 2. Spring Boot 서버로 상태 전송
      await updateMedicationStatus(slot, value);
    } catch (error) {
      // 3. 만약 서버 전송 실패 시 롤백(원래 상태로 복구) 처리 등 필요시 작성
      console.error('서버 동기화 에러 발생');
    }
  },
}));