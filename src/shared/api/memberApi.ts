import type { MemberMe } from '@shared/types';
import { axiosInstance } from './axiosInstance';

// [내 정보 조회] GET /api/member/me — 세션 복원(auth)과 마이페이지가 같이 써서 shared에 둠
export const getMyInfoApi = async (): Promise<MemberMe> => {
  const { data } = await axiosInstance.get<MemberMe>('/api/member/me');
  return data;
};

// [FCM 토큰 등록] PATCH /api/member/fcm-token — 로그인 후 등록하고, 로그아웃할 땐 ""로 보내 지움
// (서버는 빈 토큰이면 발송을 건너뜀 — 같은 기기에서 다른 계정으로 바꿔도 이전 계정 알림이 오지 않게).
// 알림 기능과 로그아웃(shared/model)이 같이 써서 shared에 둠
export const updateFcmTokenApi = async (fcmToken: string): Promise<void> => {
  await axiosInstance.patch('/api/member/fcm-token', { fcmToken });
};
