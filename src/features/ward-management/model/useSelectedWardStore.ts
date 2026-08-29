import { create } from 'zustand';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, 실제 연동된 어르신 목록(wardId)이 없으면
// 복약 스케줄 등 백엔드 wardId가 필요한 기능을 이 스토어를 거치지 않고는 쓸 수 없어 의도적으로 참조함
// (순환참조 없음, account-link는 ward-management를 참조하지 않음).
import { getConnectionsApi } from '@features/account-link/api';
import { logApiError } from '@shared/api';
import { useSessionStore } from '@shared/store/useSessionStore';
import { connectionFontSizeToOption } from '../utils';
import { MOCK_WARDS } from './mockWards';
import { Ward } from './types';

interface SelectedWardState {
  wards: Ward[];
  isLoaded: boolean;
  selectedWardId: string;
  selectWard: (wardId: string) => void;
  fetchWards: () => Promise<void>;
  // 목록(getConnectionsApi)엔 없는 phone/address 보강, 수정 화면에서의 저장 반영 등에 사용 —
  // 이 스토어가 유일한 소스여야 홈 화면 스위처/메뉴 드로어/돌봄대상자 관리 화면이 서로 어긋나지 않음
  updateWard: (id: string, patch: Partial<Ward>) => void;
}

export const useSelectedWardStore = create<SelectedWardState>(set => ({
  wards: MOCK_WARDS,
  isLoaded: false,
  selectedWardId: MOCK_WARDS[0].id,
  selectWard: wardId => set({ selectedWardId: wardId }),
  // 연동된 어르신 목록(GET /api/connection)을 실제 wardId 기준으로 불러옴.
  // 아직 한 명도 연동 안 됐거나 조회 실패 시엔 데모/개발용 MOCK_WARDS를 그대로 유지.
  fetchWards: async () => {
    try {
      const connections = await getConnectionsApi();
      if (connections.length === 0) {
        set({ isLoaded: true });
        return;
      }
      const wards: Ward[] = connections.map(connection => ({
        id: String(connection.wardId),
        // 아직 별명을 안 정해줬으면(빈 문자열) 이름으로 대체 표시
        nickname: connection.nickname || connection.wardName,
        name: connection.wardName,
        // ConnectionSummary엔 없는 필드 — WardManagementScreen이 마운트 시 각 어르신의
        // ConnectionDetail(GET /api/connection/{wardId})을 따로 불러와 updateWard로 채워 넣음
        phone: '',
        address: '',
        // 이 어르신의 ward-setting 레코드가 아직 없으면 ttsRate가 null로 내려옴 — 기본값(1.0배)으로 대체
        ttsRate: typeof connection.ttsRate === 'number' ? connection.ttsRate : 1,
        fontSize: connectionFontSizeToOption(connection.fontSize),
      }));
      set(state => ({
        wards,
        isLoaded: true,
        selectedWardId: wards.some(ward => ward.id === state.selectedWardId) ? state.selectedWardId : wards[0].id,
      }));
    } catch (error) {
      logApiError('연동된 어르신 목록 조회 실패', error);
      set({ isLoaded: true });
    }
  },
  updateWard: (id, patch) =>
    set(state => ({ wards: state.wards.map(ward => (ward.id === id ? { ...ward, ...patch } : ward)) })),
}));

// wards는 로그인 세션과 무관하게 살아있는 전역 싱글턴이라, 로그아웃해도 저절로 안 비워짐 —
// 리셋 안 하면 로그아웃 전 계정에서 불러온 목록이 다음 로그인(다른 계정일 수도 있음) 때도 그대로 남아있어서
// 매번 새로 fetchWards()를 안 부르고(isLoaded가 이미 true라서) 오래된 데이터를 계속 보여주는 버그가 있었음.
useSessionStore.subscribe((state, prevState) => {
  if (prevState.isLoggedIn && !state.isLoggedIn) {
    useSelectedWardStore.setState({ wards: MOCK_WARDS, isLoaded: false, selectedWardId: MOCK_WARDS[0].id });
  }
});
