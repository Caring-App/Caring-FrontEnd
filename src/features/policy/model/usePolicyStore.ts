import { create } from 'zustand';
import { logApiError } from '@shared/api';
import { getPoliciesApi, getPolicyDetailApi } from '../api';
import { PolicyDetail, PolicySummary, PolicyType } from './types';

interface PolicyState {
  policies: PolicySummary[];
  isLoadingList: boolean;
  detailsByType: Partial<Record<PolicyType, PolicyDetail>>;
  // 상세 조회 중인 type 집합 — 목록 화면과 상세 화면이 같은 type을 동시에 조회하는 것을 막는 용도.
  loadingTypes: Set<PolicyType>;
  fetchPolicies: () => Promise<void>;
  fetchPolicyDetail: (type: PolicyType) => Promise<void>;
}

export const usePolicyStore = create<PolicyState>((set, get) => ({
  policies: [],
  isLoadingList: false,
  detailsByType: {},
  loadingTypes: new Set(),

  fetchPolicies: async () => {
    if (get().isLoadingList) return;
    set({ isLoadingList: true });
    try {
      const policies = await getPoliciesApi();
      set({ policies });
    } catch (error) {
      logApiError('정책 목록 조회 실패', error);
    } finally {
      set({ isLoadingList: false });
    }
  },

  fetchPolicyDetail: async type => {
    if (get().loadingTypes.has(type)) return;
    set(state => ({ loadingTypes: new Set(state.loadingTypes).add(type) }));
    try {
      const detail = await getPolicyDetailApi(type);
      set(state => ({ detailsByType: { ...state.detailsByType, [type]: detail } }));
    } catch (error) {
      logApiError('정책 상세 조회 실패', error);
    } finally {
      set(state => {
        const next = new Set(state.loadingTypes);
        next.delete(type);
        return { loadingTypes: next };
      });
    }
  },
}));
