import { create } from 'zustand';
import { logApiError } from '@shared/api';
import { resetOnLogout } from '@shared/store/resetOnLogout';
import { getNearbyWelfareFacilitiesApi, isWardCoordinatesMissingError } from '../api';
import { toWelfareFacility } from '../utils';
import { WELFARE_SEARCH_RADIUS_KM } from './constants';
import { WelfareFacility } from './types';

interface WelfareFacilityState {
  facilitiesByWard: Record<number, WelfareFacility[]>;
  // 조회 중인 wardId 집합 — useWardLocationStore와 같은 이유로 중복 요청 방지
  loadingWardIds: Set<number>;
  // 마지막 조회 실패 시 보여줄 안내 문구. 성공하면 지움
  errorByWard: Record<number, string>;
  fetchFacilities: (wardId: number) => Promise<void>;
  // 어르신 주소가 바뀌어 기존 결과가 더 이상 맞지 않을 때 호출 — 캐시를 비우면 화면에 떠 있는
  // useNearbyWelfareFacilities가 "아직 조회 안 함" 상태로 보고 자동으로 다시 조회함
  invalidate: (wardId: number) => void;
}

const WARD_COORDINATES_MISSING_TEXT =
  '어르신 주소 정보가 없어 주변 시설을 찾을 수 없어요. 돌봄대상자 관리에서 주소를 등록해 주세요.';
const DEFAULT_ERROR_TEXT = '시설 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';

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
          // 서버 메시지는 개발자용 문장이라 그대로 보여주지 않고, 보호자가 할 수 있는 조치를 안내함
          [wardId]: isWardCoordinatesMissingError(error) ? WARD_COORDINATES_MISSING_TEXT : DEFAULT_ERROR_TEXT,
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

  invalidate: wardId =>
    set(state => {
      const facilitiesByWard = { ...state.facilitiesByWard };
      const errorByWard = { ...state.errorByWard };
      delete facilitiesByWard[wardId];
      delete errorByWard[wardId];
      return { facilitiesByWard, errorByWard };
    }),
}));

resetOnLogout(useWelfareFacilityStore);
