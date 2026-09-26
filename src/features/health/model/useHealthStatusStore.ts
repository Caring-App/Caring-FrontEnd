import { create } from 'zustand';
import { resetOnLogout } from '@shared/store/resetOnLogout';
import { logApiError } from '@shared/api';
import { checkMoodApi, getMoodCheckApi, getMyMoodCheckApi } from '../api';
import { healthStatusToMoodStatus, moodStatusToHealthStatus } from '../utils';
import type { MoodCheckRecord } from './moodTypes';

export type HealthStatus = 'good' | 'normal' | 'bad';

// 조회 결과를 statusByWard에 반영. 기록이 없으면(null) 전날 값 등이 남아있지 않도록 해당 어르신 키를 비움
function withRecord(statusByWard: Record<number, HealthStatus>, wardId: number, record: MoodCheckRecord | null) {
  const next = { ...statusByWard };
  if (record) next[wardId] = moodStatusToHealthStatus(record.moodStatus);
  else delete next[wardId];
  return next;
}

interface HealthStatusState {
  statusByWard: Record<number, HealthStatus>;
  // 조회 중인 wardId 집합 — useWardLocationStore와 같은 이유로 중복 요청 방지
  loadingWardIds: Set<number>;
  // 보호자 화면에서 특정 어르신의 오늘 상태를 조회
  fetchStatus: (wardId: number) => Promise<void>;
  // 돌봄대상자 화면에서 본인의 오늘 상태를 조회(wardId는 로그인한 본인 memberId, 저장 키로만 씀)
  fetchMyStatus: (wardId: number) => Promise<void>;
  // 돌봄대상자가 직접 오늘의 상태를 기록. 실패하면 되돌린 뒤 에러를 다시 던짐(화면에서 사유 안내용)
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
      set(state => ({ statusByWard: withRecord(state.statusByWard, wardId, record) }));
    } catch (error) {
      logApiError('오늘의 건강 상태 조회 실패', error);
    } finally {
      set(state => {
        const next = new Set(state.loadingWardIds);
        next.delete(wardId);
        return { loadingWardIds: next };
      });
    }
  },

  fetchMyStatus: async wardId => {
    try {
      const record = await getMyMoodCheckApi();
      set(state => ({ statusByWard: withRecord(state.statusByWard, wardId, record) }));
    } catch (error) {
      logApiError('본인 오늘의 건강 상태 조회 실패', error);
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
      throw error;
    }
  },
}));

resetOnLogout(useHealthStatusStore);
