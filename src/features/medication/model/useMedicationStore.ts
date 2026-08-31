import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import EncryptedStorage from 'react-native-encrypted-storage';
import { MOCK_WARDS } from '@features/ward-management/model';

export type MealSlot = 'morning' | 'lunch' | 'dinner';
export type MedicationTaken = Record<MealSlot, boolean>;

interface MedicationState {
  // TODO: "오늘 복용했는지" 여부를 서버에 기록하는 API가 아직 없어서(복약 스케줄 자체를 정의하는
  // /api/pill/schedule과는 별개 개념) 기기 로컬 저장까지만 함 — 보호자/어르신이 서로 다른 기기를
  // 쓰는 실서비스에서는 이것만으론 동기화가 안 되고, 해당 API가 생기면 그쪽으로 교체 필요.
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
