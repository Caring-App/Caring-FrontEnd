import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import EncryptedStorage from 'react-native-encrypted-storage';
import { MOCK_WARDS } from '@features/ward-management/model';

export type MealSlot = 'morning' | 'lunch' | 'dinner';
export type MedicationTaken = Record<MealSlot, boolean>;

interface MedicationState {
  // 연동 전 목업 어르신(사용가이드 투어 등) 전용 로컬 값. 실제 어르신의 복용 기록은 서버가 원본 —
  // 어르신 화면은 useTodayPills(/api/pill/today, /api/pill/confirm), 보호자 화면은 useWardTodayMedication(알림 기록) 참고.
  takenByWard: Record<string, MedicationTaken>;
  setTaken: (wardId: string, slot: MealSlot, value: boolean) => void;
}

// TODO: 백엔드 연동 전 mock 데이터, 어르신별로 다른 값임을 보여주기 위한 임시 시드
const MOCK_TAKEN_BY_WARD: Record<string, MedicationTaken> = {
  [MOCK_WARDS[0].id]: { morning: true, lunch: true, dinner: false },
  [MOCK_WARDS[1].id]: { morning: true, lunch: false, dinner: false },
};

export const useMedicationStore = create<MedicationState>()(
  persist(
    set => ({
      takenByWard: MOCK_TAKEN_BY_WARD,
      setTaken: (wardId, slot, value) =>
        set(state => ({
          takenByWard: {
            ...state.takenByWard,
            [wardId]: { ...state.takenByWard[wardId], [slot]: value },
          },
        })),
    }),
    {
      // 로그인 세션과 무관하게 기기에 그대로 남아있어야 하는 값이라(로그아웃/재로그인해도 유지),
      // useSelectedWardStore처럼 로그아웃 시 초기화하지 않음 — 토큰 저장에 이미 쓰는
      // EncryptedStorage를 그대로 재사용(AsyncStorage 등 새 네이티브 의존성 추가/재빌드 불필요).
      name: 'medication-taken-by-ward',
      storage: createJSONStorage(() => EncryptedStorage),
    },
  ),
);
