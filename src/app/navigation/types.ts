import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  SignupTypeSelect: undefined;
  TermsAgreement: { role?: 'PROTECTOR' | 'WARD' } | undefined;
  Signup: undefined;
  SignupWelcome: { userName?: string; protectorCode?: string } | undefined;
  WardSignup: undefined;
  WardSignupWelcome: { userName?: string } | undefined;
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
