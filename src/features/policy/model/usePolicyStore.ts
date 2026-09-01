import { create } from 'zustand';
import { logApiError } from '@shared/api';
import { getPoliciesApi, getPolicyDetailApi } from '../api';
import { PolicyDetail, PolicySummary, PolicyType } from './types';

interface PolicyState {
  policies: PolicySummary[];
  isLoadingList: boolean;
  // 목록 조회가 실패했는지 여부 — 실패해서 policies가 빈 배열인 것과 정말 항목이 없는 것을 화면에서
  // 구분하기 위한 용도.
  hasListError: boolean;
  detailsByType: Partial<Record<PolicyType, PolicyDetail>>;
  // 상세 조회 중인 type 집합 — 목록 화면과 상세 화면이 같은 type을 동시에 조회하는 것을 막는 용도.
  loadingTypes: Set<PolicyType>;
  // 상세 조회가 실패한 type 집합 — 화면이 "로딩 중"과 "실패"를 구분해서 무한 스피너 대신 에러 문구를
  // 보여줄 수 있게 함.
  errorTypes: Set<PolicyType>;
  fetchPolicies: () => Promise<void>;
  fetchPolicyDetail: (type: PolicyType) => Promise<void>;
}

export const usePolicyStore = create<PolicyState>((set, get) => ({
  policies: [],
  isLoadingList: false,
  hasListError: false,
  detailsByType: {},
  loadingTypes: new Set(),
  errorTypes: new Set(),

  fetchPolicies: async () => {
    if (get().isLoadingList) return;
    set({ isLoadingList: true, hasListError: false });
    try {
      const policies = await getPoliciesApi();
      set({ policies });
    } catch (error) {
      logApiError('정책 목록 조회 실패', error);
      set({ hasListError: true });
    } finally {
      set({ isLoadingList: false });
    }
  },

  fetchPolicyDetail: async type => {
    if (get().loadingTypes.has(type)) return;
    set(state => {
      const errorTypes = new Set(state.errorTypes);
      errorTypes.delete(type);
      return { loadingTypes: new Set(state.loadingTypes).add(type), errorTypes };
    });
    try {
      const detail = await getPolicyDetailApi(type);
      set(state => ({ detailsByType: { ...state.detailsByType, [type]: detail } }));
    } catch (error) {
      logApiError('정책 상세 조회 실패', error);
      set(state => ({ errorTypes: new Set(state.errorTypes).add(type) }));
    } finally {
      set(state => {
        const next = new Set(state.loadingTypes);
        next.delete(type);
        return { loadingTypes: next };
      });
    }
  },
}));
