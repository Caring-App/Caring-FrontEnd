import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import EncryptedStorage from 'react-native-encrypted-storage';
import { MOCK_WARDS } from '@features/ward-management/model';

export type MealSlot = 'morning' | 'lunch' | 'dinner';
export type MedicationTaken = Record<MealSlot, boolean>;

interface MedicationState {
  // 어르신 쪽 복용 기록은 이제 서버(/api/pill/today, /api/pill/confirm — useTodayPills)가 원본이고,
  // 이 값은 같은 기기의 보호자 화면(MedicationSection, DailyReportCard)에 보여주려고 useTodayPills가 맞춰 넣어주는 사본.
  // TODO: 보호자용 "어르신 오늘 복약 상태" 조회 API가 없어서 보호자가 다른 기기를 쓰면 반영 안 됨 — 생기면 교체 필요.
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
