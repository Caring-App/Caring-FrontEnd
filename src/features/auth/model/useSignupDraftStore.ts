import { create } from 'zustand';
import { UserRole } from '@shared/types';
import { SocialSignupProfile } from './types';

// 회원가입이 약관 → 본인인증 → 인증번호 → 비밀번호 → 주소 → (기저질환) 여러 화면으로 쪼개져 있어서,
// 마지막 화면에서 한 번에 가입 API를 호출할 수 있도록 단계별 입력값을 모아두는 임시 저장소.
// 비밀번호가 들어있으므로 가입이 끝나거나 중간에 X로 나가면 반드시 reset할 것.
interface SignupDraftState {
  role: UserRole | null;
  // 소셜 신규 회원가입이면 이름/전화번호는 카카오·네이버 프로필에서 받아오므로 본인인증·비밀번호 단계를 건너뜀
  social: SocialSignupProfile | null;
  name: string;
  phone: string;
  authCode: string;
  password: string;
  passwordConfirm: string;
  baseAddress: string;
  detailAddress: string;
  diseases: string[];
  start: (role: UserRole, social?: SocialSignupProfile) => void;
  setIdentity: (name: string, phone: string) => void;
  setAuthCode: (authCode: string) => void;
  setPassword: (password: string, passwordConfirm: string) => void;
  setAddress: (baseAddress: string, detailAddress: string) => void;
  setDiseases: (diseases: string[]) => void;
  reset: () => void;
}

const INITIAL_DRAFT = {
  role: null,
  social: null,
  name: '',
  phone: '',
  authCode: '',
  password: '',
  passwordConfirm: '',
  baseAddress: '',
  detailAddress: '',
  diseases: [],
};

export const useSignupDraftStore = create<SignupDraftState>(set => ({
  ...INITIAL_DRAFT,
  start: (role, social) => set({ ...INITIAL_DRAFT, role, social: social ?? null }),
  setIdentity: (name, phone) => set({ name, phone }),
  setAuthCode: authCode => set({ authCode }),
  setPassword: (password, passwordConfirm) => set({ password, passwordConfirm }),
  setAddress: (baseAddress, detailAddress) => set({ baseAddress, detailAddress }),
  setDiseases: diseases => set({ diseases }),
  reset: () => set(INITIAL_DRAFT),
}));
