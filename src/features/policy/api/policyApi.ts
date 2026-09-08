import { axiosInstance } from '@shared/api/axiosInstance';
import { PolicyDetail, PolicySummary, PolicyType } from '../model/types';

// [정책/약관 목록 조회]
export const getPoliciesApi = async (): Promise<PolicySummary[]> => {
  const { data } = await axiosInstance.get<PolicySummary[]>('/api/policy');
  return data;
};

// [정책/약관 상세 조회]
export const getPolicyDetailApi = async (type: PolicyType): Promise<PolicyDetail> => {
  const { data } = await axiosInstance.get<PolicyDetail>(`/api/policy/${type}`);
  return data;
};
