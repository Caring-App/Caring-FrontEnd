import { create } from 'zustand';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, 실제 연동된 어르신 목록(wardId)이 없으면
// 복약 스케줄 등 백엔드 wardId가 필요한 기능을 이 스토어를 거치지 않고는 쓸 수 없어 의도적으로 참조함
// (순환참조 없음, account-link는 ward-management를 참조하지 않음).
import { getConnectionsApi } from '@features/account-link/api';
// 연동된 어르신이 없을 때 사용 가이드(투어) 동안에만 목업 어르신을 보여주기 위해 투어 상태를 읽음
// (순환참조 없음, guardian-tour는 ward-management를 참조하지 않음)
import { useTourStore } from '@features/guardian-tour/model';
import { logApiError } from '@shared/api';
import { notifyLoadFailed } from '@shared/model';
import { resetOnLogout } from '@shared/store/resetOnLogout';
import { connectionFontSizeToOption } from '../utils';
import { MOCK_WARDS } from './mockWards';
import { Ward } from './types';

interface SelectedWardState {
  // 실제로 연동된 어르신 목록(한 명도 없으면 빈 배열). 화면에서는 투어용 목업까지 반영한 useWardList/useSelectedWard를 쓸 것
  wards: Ward[];
  isLoaded: boolean;
  isLoading: boolean;
  // 연동된 어르신이 없으면 빈 문자열
  selectedWardId: string;
  selectWard: (wardId: string) => void;
  fetchWards: () => Promise<void>;
  // 목록(getConnectionsApi)엔 없는 phone/address 보강, 수정 화면에서의 저장 반영 등에 사용 —
  // 이 스토어가 유일한 소스여야 홈 화면 스위처/메뉴 드로어/돌봄대상자 관리 화면이 서로 어긋나지 않음
  updateWard: (id: string, patch: Partial<Ward>) => void;
}

export const useSelectedWardStore = create<SelectedWardState>((set, get) => ({
  wards: [],
  isLoaded: false,
  isLoading: false,
  selectedWardId: '',
  selectWard: wardId => set({ selectedWardId: wardId }),
  // 연동된 어르신 목록(GET /api/connection)을 실제 wardId 기준으로 불러옴.
  // 한 명도 연동 안 됐으면 빈 목록, 조회 실패 시엔 기존 목록을 그대로 둠.
  fetchWards: async () => {
    // 여러 화면이 동시에 마운트되며 각자 fetchWards를 부르는 경우가 있어(홈/돌봄대상자 관리 탭 등)
    // 이미 진행 중이면 중복 요청하지 않음.
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const connections = await getConnectionsApi();
      if (connections.length === 0) {
        set({ wards: [], selectedWardId: '', isLoaded: true });
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
      notifyLoadFailed();
      set({ isLoaded: true });
    } finally {
      set({ isLoading: false });
    }
  },
  updateWard: (id, patch) =>
    set(state => ({ wards: state.wards.map(ward => (ward.id === id ? { ...ward, ...patch } : ward)) })),
}));

// 로그아웃 전 계정의 wards가 남아있으면 isLoaded가 true라 다음 로그인 때 fetchWards()를 안 부르고
// 오래된 목록을 계속 보여주는 버그가 있었음 — 초기값(빈 목록, isLoaded=false)으로 되돌림.
resetOnLogout(useSelectedWardStore);

// 화면에 보여줄 어르신 목록 — 연동된 어르신이 없으면 빈 배열이고, 사용 가이드(투어) 중일 때만 목업 어르신을 돌려줌.
// 투어는 연동 전에도 각 화면을 하이라이트해야 해서 목업이 필요함. store에 목업을 넣었다 빼는 방식은 투어 종료를
// 놓치면 목업이 계속 남을 수 있어서, 읽을 때마다 투어 상태로 계산함. 목업 id('mother' 등)는 숫자가 아니라
// 위치·건강·복약 등 각 도메인이 이 id를 보면 서버 대신 데모 값을 보여줌(useWardLocation 등 참고)
export function useWardList(): Ward[] {
  const wards = useSelectedWardStore(state => state.wards);
  const isTourActive = useTourStore(state => state.isActive);
  return wards.length === 0 && isTourActive ? MOCK_WARDS : wards;
}

// 지금 선택된(화면에 보여줄) 어르신 — 없으면 ward는 undefined, selectedWardId는 빈 문자열
export function useSelectedWard(): { wards: Ward[]; ward: Ward | undefined; selectedWardId: string } {
  const wards = useWardList();
  const selectedWardId = useSelectedWardStore(state => state.selectedWardId);
  const ward = wards.find(item => item.id === selectedWardId) ?? wards[0];
  return { wards, ward, selectedWardId: ward?.id ?? '' };
}
