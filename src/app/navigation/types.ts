import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SocialAccessToken, SocialSignupProfile } from '@features/auth/model';
import { PolicyType } from '@features/policy/model';
import { WelfareFacility } from '@features/welfare-facility/model';

export type AuthStackParamList = {
  // 앱 첫 실행 시 잠깐 보여주는 오렌지 로고 화면 — 이후 시작 화면(Login)으로 replace
  Splash: undefined;
  // 시작 화면: 카카오/네이버/전화번호 로그인, 회원가입 버튼
  Login: undefined;
  PhoneLogin: undefined;
  ResetPassword: undefined;
  // 간편 로그인 버튼으로 들어온 경우에만 social이 채워짐 — 로컬 회원가입 진입 시엔 undefined
  SignupTypeSelect: { social?: SocialAccessToken } | undefined;
  // 소셜 신규 회원 흐름에서만 social이 채워짐(신규 확인 후 프로필까지 포함)
  TermsAgreement: { role: 'PROTECTOR' | 'WARD'; social?: SocialSignupProfile };
  // 이후 회원가입 단계 화면들은 입력값을 useSignupDraftStore에 모으므로 params 없음
  // (소셜 회원가입은 본인인증~비밀번호 단계를 건너뛰고 약관 → 주소로 바로 감)
  SignupIdentity: undefined;
  SignupVerifyCode: undefined;
  SignupPassword: undefined;
  SignupAddress: undefined;
  SignupDisease: undefined;
  SignupWelcome: { userName?: string; protectorCode?: string } | undefined;
  WardSignupWelcome: { userName?: string } | undefined;
  LinkAccount: undefined;
  LinkAccountComplete: { protectorName?: string } | undefined;
};

// 인증 스택 화면들이 공유하는 훅(useSignupSubmit 등)에서 navigation 타입으로 씀
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

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
  // 백엔드 응답에 시설 고유 id가 없어서 목록에서 받은 시설 정보를 통째로 넘김
  WelfareFacilityDetail: { facility: WelfareFacility };
  Settings: undefined;
  Withdrawal: undefined;
  Inquiry: undefined;
  InquiryChat: undefined;
  Faq: undefined;
  Policy: undefined;
  PolicyDetail: { type: PolicyType };
};

export type SeniorStackParamList = {
  SeniorHome: undefined;
  SeniorSchedule: undefined;
};
