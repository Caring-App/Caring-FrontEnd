import axios from 'axios';
import { create } from 'zustand';
import { resetOnLogout } from '@shared/store/resetOnLogout';
import { logApiError } from '@shared/api';
import { checkMoodApi, getMoodCheckApi } from '../api';
import { healthStatusToMoodStatus, moodStatusToHealthStatus } from '../utils';

export type HealthStatus = 'good' | 'normal' | 'bad';

// 어르신이 오늘 아직 상태를 안 눌렀을 때도 백엔드가 200+빈 값 대신 400(IllegalArgumentException)을 줌.
// 권한 없음 등 진짜 400과 구분하려고 메시지까지 비교함 — 백엔드가 200/204로 바꿔주면 이 분기는 제거.
const NO_RECORD_TODAY_MESSAGE = '아직 오늘의 기록이 없습니다.';

function isNoRecordTodayError(error: unknown) {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 400 &&
    error.response.data?.message === NO_RECORD_TODAY_MESSAGE
  );
}

interface HealthStatusState {
  statusByWard: Record<number, HealthStatus>;
  // 조회 중인 wardId 집합 — useWardLocationStore와 같은 이유로 중복 요청 방지
  loadingWardIds: Set<number>;
  // 보호자 화면에서 특정 어르신의 오늘 상태를 조회
  fetchStatus: (wardId: number) => Promise<void>;
  // 돌봄대상자가 직접 오늘의 상태를 기록
  checkStatus: (wardId: number, status: HealthStatus) => Promise<void>;
}

export const useHealthStatusStore = create<HealthStatusState>((set, get) => ({
  statusByWard: {},
  loadingWardIds: new Set(),

  fetchStatus: async wardId => {
    if (get().loadingWardIds.has(wardId)) return;
    set(state => ({ loadingWardIds: new Set(state.loadingWardIds).add(wardId) }));
    try {
      const record = await getMoodCheckApi(wardId);
      set(state => ({
        statusByWard: { ...state.statusByWard, [wardId]: moodStatusToHealthStatus(record.moodStatus) },
      }));
    } catch (error) {
      if (isNoRecordTodayError(error)) {
        // 에러가 아니라 "아직 기록 안 함" — 전날 값 등이 남아있지 않도록 비워둠
        set(state => {
          const next = { ...state.statusByWard };
          delete next[wardId];
          return { statusByWard: next };
        });
        return;
      }
      logApiError('오늘의 건강 상태 조회 실패', error);
    } finally {
      set(state => {
        const next = new Set(state.loadingWardIds);
        next.delete(wardId);
        return { loadingWardIds: next };
      });
    }
  },

  // 버튼을 누르면 바로 이모지가 바뀌어야 자연스러워서 먼저 로컬에 반영하고, 실패하면 이전 값으로
  // 되돌림(useNotificationStore.markAsRead와 같은 이유).
  checkStatus: async (wardId, status) => {
    const previous = get().statusByWard[wardId];
    set(state => ({ statusByWard: { ...state.statusByWard, [wardId]: status } }));
    try {
      await checkMoodApi(healthStatusToMoodStatus(status));
    } catch (error) {
      logApiError('오늘의 건강 상태 기록 실패', error);
      set(state => {
        const next = { ...state.statusByWard };
        if (previous) next[wardId] = previous;
        else delete next[wardId];
        return { statusByWard: next };
      });
    }
  },
}));

resetOnLogout(useHealthStatusStore);
