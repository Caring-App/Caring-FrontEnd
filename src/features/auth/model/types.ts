import { UserRole } from '@shared/types';

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  memberId: number;
  name: string;
  nickname: string;
  role: UserRole;
  authLevel: string;
  accessToken: string;
  refreshToken: string;
}

// [간편 로그인 확인] POST /api/auth/{provider} — 기존 회원이면 로그인 정보가, 신규 회원이면 newMember만 내려옴
export interface SocialLoginCheckResponse {
  newMember: boolean;
  memberId?: number;
  name?: string;
  nickname?: string;
  role?: UserRole;
  accessToken?: string;
  refreshToken?: string;
}

export interface RegisterProtectorRequest {
  name: string;
  phone: string;
  authNumber: string;
  password: string;
  passwordCheck: string;
  address: string;
}

export interface RegisterProtectorResponse {
  memberId: number;
  name: string;
  phone: string;
  protectorCode: string;
}

export interface RegisterWardRequest extends RegisterProtectorRequest {
  diseases: string[];
}

export interface RegisterWardResponse {
  memberId: number;
  name: string;
  phone: string;
  diseases: string[];
}

export interface ResetPasswordRequest {
  phone: string;
  authNumber: string;
  newPassword: string;
  newPasswordCheck: string;
}

// 간편 로그인/회원가입에서 URL 경로·SDK 분기에 쓰는 값 (구글은 지원 중단으로 제외)
export type SocialProvider = 'kakao' | 'naver';

// register/social의 provider 필드는 백엔드 컨벤션에 맞춰 대문자로 보냄
export type SocialProviderCode = 'KAKAO' | 'NAVER';

export interface RegisterSocialRequest {
  provider: SocialProviderCode;
  providerId: string;
  role: UserRole;
  name: string;
  phone: string;
  address: string;
  diseases?: string[];
}

export interface RegisterSocialResponse {
  memberId: number;
  name: string;
  phone: string;
  role: UserRole;
  protectorCode: string;
  diseases: string[];
  accessToken: string;
  refreshToken: string;
}

// 소셜 SDK 동의(로그인)만 마친 상태 — 역할 선택 화면으로 넘길 때 씀
export interface SocialAccessToken {
  provider: SocialProvider;
  accessToken: string;
}

// 신규 회원으로 확인된 뒤, 약관 동의 → 추가 정보 입력 화면까지 들고 다니는 소셜 프로필
export interface SocialSignupProfile extends SocialAccessToken {
  providerId: string;
  name: string;
  phone: string;
}
