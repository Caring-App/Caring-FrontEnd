import { axiosInstance } from '@shared/api/axiosInstance';
import { MyPageUpdateRequest, PhoneChangeRequest, ProtectorCodeResponse } from '../model/types';

// [개인 정보 수정] — 주소(항상), 비밀번호(newPassword가 있을 때만)
export const updateMyPageApi = async (payload: MyPageUpdateRequest): Promise<void> => {
  await axiosInstance.patch('/api/member', payload);
};

// [전화번호 변경] — SMS 인증을 마친 새 번호로 변경
export const changePhoneApi = async (payload: PhoneChangeRequest): Promise<void> => {
  await axiosInstance.patch('/api/member/phone', payload);
};

// [푸시 알림 켜기/끄기] — 값을 보내지 않고 서버가 현재 값을 반대로 뒤집음(멱등 아님, 연달아 호출하면 되돌아감)
export const togglePushApi = async (): Promise<void> => {
  await axiosInstance.post('/api/member/push-toggle');
};

// [보호자 연동 코드 조회]
export const getProtectorCodeApi = async (): Promise<string> => {
  const { data } = await axiosInstance.get<ProtectorCodeResponse>('/api/member/protector-code');
  return data.protectorCode;
};

// [회원 탈퇴] — 보호자면 연동된 돌봄대상자 계정까지 함께 삭제됨(서버 동작)
export const withdrawApi = async (): Promise<void> => {
  await axiosInstance.delete('/api/member');
};
