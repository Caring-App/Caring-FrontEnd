import { create } from 'zustand';

export type HealthStatus = 'good' | 'normal' | 'bad';

interface HealthStatusState {
  // TODO: 실서비스에서는 돌봄대상자 앱 → 서버 → 보호자 앱으로 동기화되는 값으로 교체 필요
  status: HealthStatus | null;
  setStatus: (status: HealthStatus) => void;
}

export const useHealthStatusStore = create<HealthStatusState>(set => ({
  status: null,
  setStatus: status => set({ status }),
}));
