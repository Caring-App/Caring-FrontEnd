import { axiosInstance } from '@shared/api/axiosInstance';
import {
  LoginRequest,
  LoginResponse,
  RegisterProtectorRequest,
  RegisterProtectorResponse,
  RegisterSocialRequest,
  RegisterSocialResponse,
  RegisterWardRequest,
  RegisterWardResponse,
  ResetPasswordRequest,
} from '../model/types';

// [로그인] 전화번호 + 비밀번호
export const loginApi = async (payload: LoginRequest): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post<LoginResponse>('/api/auth/login', payload);
  return data;
};

// [SMS 인증번호 발송]
export const sendSmsCodeApi = async (phone: string): Promise<void> => {
  await axiosInstance.post('/api/auth/sms/send', null, { params: { phone } });
};

// [SMS 인증번호 확인]
export const verifySmsCodeApi = async (phone: string, code: string): Promise<void> => {
  await axiosInstance.post('/api/auth/sms/verify', null, { params: { phone, code } });
};

// [보호자 회원가입]
export const registerProtectorApi = async (
  payload: RegisterProtectorRequest,
): Promise<RegisterProtectorResponse> => {
  const { data } = await axiosInstance.post<RegisterProtectorResponse>('/api/auth/register/protector', payload);
  return data;
};

// [돌봄대상자 회원가입]
export const registerWardApi = async (payload: RegisterWardRequest): Promise<RegisterWardResponse> => {
  const { data } = await axiosInstance.post<RegisterWardResponse>('/api/auth/register/ward', payload);
  return data;
};

// [소셜 회원가입] — 소셜 로그인 시도 결과 신규 회원(newMember: true)인 경우 추가 정보를 받아 가입 처리
export const registerSocialApi = async (payload: RegisterSocialRequest): Promise<RegisterSocialResponse> => {
  const { data } = await axiosInstance.post<RegisterSocialResponse>('/api/auth/register/social', payload);
  return data;
};

// [비밀번호 재설정] — SMS 인증(authNumber) 완료 후 새 비밀번호로 변경
export const resetPasswordApi = async (payload: ResetPasswordRequest): Promise<void> => {
  await axiosInstance.post('/api/auth/password/reset', payload);
};

// 액세스 토큰 재발급은 axiosInstance의 401 인터셉터가 무한 재시도 방지를 위해 axiosInstance를 거치지 않고
// 직접 axios로 호출함 (axiosInstance.ts 참고) — 여기서 별도 함수로 두면 실수로 axiosInstance를 통해 호출해
// 무한루프에 빠질 수 있어 의도적으로 두지 않음.
