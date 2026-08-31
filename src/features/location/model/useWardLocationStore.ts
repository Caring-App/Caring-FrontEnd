import { create } from 'zustand';
import { logApiError } from '@shared/api';
import { getWardLatestLocationApi } from '../api';
import { WardLocation } from './types';

interface WardLocationState {
  locationsByWard: Record<number, WardLocation>;
  // 조회 중인 wardId 집합 — 홈 화면 카드와 지도 상세 화면이 같은 wardId를 동시에 조회하는 것을 막는 용도.
  loadingWardIds: Set<number>;
  fetchLocation: (wardId: number) => Promise<void>;
}

export const useWardLocationStore = create<WardLocationState>((set, get) => ({
  locationsByWard: {},
  loadingWardIds: new Set(),
  fetchLocation: async wardId => {
    if (get().loadingWardIds.has(wardId)) return;
    set(state => ({ loadingWardIds: new Set(state.loadingWardIds).add(wardId) }));
    try {
      const location = await getWardLatestLocationApi(wardId);
      set(state => ({ locationsByWard: { ...state.locationsByWard, [wardId]: location } }));
    } catch (error) {
      logApiError('어르신 최신 위치 조회 실패', error);
    } finally {
      set(state => {
        const next = new Set(state.loadingWardIds);
        next.delete(wardId);
        return { loadingWardIds: next };
      });
    }
  },
}));
