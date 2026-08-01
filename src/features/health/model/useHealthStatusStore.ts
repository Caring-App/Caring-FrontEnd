import { create } from 'zustand';
import { MOCK_WARDS } from '@features/ward-management/model';

export type HealthStatus = 'good' | 'normal' | 'bad';

interface HealthStatusState {
  // TODO: 실서비스에서는 돌봄대상자 앱 → 서버 → 보호자 앱으로 동기화되는 값으로 교체 필요
  statusByWard: Record<string, HealthStatus | null>;
  setStatus: (wardId: string, status: HealthStatus) => void;
}

// TODO: 백엔드 연동 전 mock 데이터, 어르신별로 다른 값임을 보여주기 위한 임시 시드
const MOCK_STATUS_BY_WARD: Record<string, HealthStatus> = {
  [MOCK_WARDS[0].id]: 'good',
  [MOCK_WARDS[1].id]: 'normal',
};

export const useHealthStatusStore = create<HealthStatusState>(set => ({
  statusByWard: MOCK_STATUS_BY_WARD,
  setStatus: (wardId, status) =>
    set(state => ({ statusByWard: { ...state.statusByWard, [wardId]: status } })),
}));
