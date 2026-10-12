import type { MemberMe } from '@shared/types';
import { axiosInstance } from './axiosInstance';

// [내 정보 조회] GET /api/member/me — 세션 복원(auth)과 마이페이지가 같이 써서 shared에 둠
export const getMyInfoApi = async (): Promise<MemberMe> => {
  const { data } = await axiosInstance.get<MemberMe>('/api/member/me');
  return data;
};
