export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  LinkAccount: undefined;
};

export type GuardianTabParamList = {
  Home: undefined;
  WardManagement: undefined;
  Profile: undefined;
};

export type GuardianStackParamList = {
  Tabs: undefined;
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
