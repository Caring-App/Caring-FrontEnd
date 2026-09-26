import { create } from 'zustand';
import { getApiErrorMessage, logApiError } from '@shared/api';
import { getNearbyWelfareFacilitiesApi } from '../api';
import { toWelfareFacility } from '../utils';
import { WELFARE_SEARCH_RADIUS_KM } from './constants';
import { WelfareFacility } from './types';

interface WelfareFacilityState {
  facilitiesByWard: Record<number, WelfareFacility[]>;
  // 조회 중인 wardId 집합 — useWardLocationStore와 같은 이유로 중복 요청 방지
  loadingWardIds: Set<number>;
  // 마지막 조회 실패 사유(서버 메시지 또는 기본 문구). 성공하면 지움
  errorByWard: Record<number, string>;
  fetchFacilities: (wardId: number) => Promise<void>;
}

export const useWelfareFacilityStore = create<WelfareFacilityState>((set, get) => ({
  facilitiesByWard: {},
  loadingWardIds: new Set(),
  errorByWard: {},

  fetchFacilities: async wardId => {
    if (get().loadingWardIds.has(wardId)) return;
    set(state => {
      const errorByWard = { ...state.errorByWard };
      delete errorByWard[wardId];
      return { loadingWardIds: new Set(state.loadingWardIds).add(wardId), errorByWard };
    });
    try {
      const facilities = await getNearbyWelfareFacilitiesApi(wardId, WELFARE_SEARCH_RADIUS_KM);
      set(state => ({
        facilitiesByWard: { ...state.facilitiesByWard, [wardId]: facilities.map(toWelfareFacility) },
      }));
    } catch (error) {
      logApiError('주변 공공 복지 시설 조회 실패', error);
      set(state => ({
        errorByWard: {
          ...state.errorByWard,
          [wardId]: getApiErrorMessage(error) ?? '시설 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
        },
      }));
    } finally {
      set(state => {
        const next = new Set(state.loadingWardIds);
        next.delete(wardId);
        return { loadingWardIds: next };
      });
    }
  },
}));
