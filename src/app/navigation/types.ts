import { NavigatorScreenParams } from '@react-navigation/native';
import { SocialAccessToken, SocialSignupProfile } from '@features/auth/model';

export type AuthStackParamList = {
  Login: undefined;
  // 간편 로그인 버튼으로 들어온 경우에만 social이 채워짐 — 로컬 회원가입 진입 시엔 undefined
  SignupTypeSelect: { social?: SocialAccessToken } | undefined;
  // 소셜 신규 회원 흐름에서만 social이 채워짐(신규 확인 후 프로필까지 포함)
  TermsAgreement: { role?: 'PROTECTOR' | 'WARD'; social?: SocialSignupProfile } | undefined;
  Signup: undefined;
  SignupWelcome: { userName?: string; protectorCode?: string } | undefined;
  WardSignup: undefined;
  WardSignupWelcome: { userName?: string } | undefined;
  // 소셜 신규 회원가입의 마지막 단계 — 역할별 추가 정보(주소/기저질환) 입력
  SocialAdditionalInfo: { role: 'PROTECTOR' | 'WARD' } & SocialSignupProfile;
  LinkAccount: undefined;
  LinkAccountComplete: { protectorName?: string } | undefined;
};

export type GuardianTabParamList = {
  Home: undefined;
  WardManagement: undefined;
  Profile: undefined;
};

export type GuardianStackParamList = {
  Tabs: NavigatorScreenParams<GuardianTabParamList> | undefined;
  Map: undefined;
  Medication: undefined;
  Schedule: undefined;
  Notification: undefined;
  WelfareFacilities: undefined;
  WelfareFacilityDetail: { facilityId: string };
  Settings: undefined;
  Withdrawal: undefined;
  Inquiry: undefined;
  InquiryChat: undefined;
  Faq: undefined;
  Policy: undefined;
};

export type SeniorStackParamList = {
  SeniorHome: undefined;
  SeniorSchedule: undefined;
};
