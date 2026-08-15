import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSessionStore } from '@shared/store/useSessionStore';
import LoginScreen from '@screens/auth/Login/LoginScreen';
import { SignupTypeSelectScreen } from '@screens/auth/Signup/SignupTypeSelectScreen';
import TermsAgreementScreen from '@screens/auth/terms/TermsAgreementScreen';
import SignupScreen from '@screens/auth/Signup/SignupScreen';
import WardSignupScreen from '@screens/auth/Signup/WardSignupScreen';
import { SignupWelcomeScreen } from '@screens/auth/welcome-guide/SignupWelcomeScreen';
import { WardSignupWelcomeScreen } from '@screens/auth/welcome-guide/WardSignupWelcomeScreen';
import LinkAccountScreen from '@screens/auth/LinkAccount/LinkAccountScreen';
import { LinkAccountCompleteScreen } from '@screens/auth/LinkAccount/LinkAccountCompleteScreen';
import { GuardianStackNavigator } from './GuardianStackNavigator';
import { SeniorStackNavigator } from './SeniorStackNavigator';
import { AuthStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const RootNavigator = () => {
  const isLoggedIn = useSessionStore(state => state.isLoggedIn);
  const role = useSessionStore(state => state.role);

  // 1. 보호자(PROTECTOR)로 로그인된 경우
  if (isLoggedIn && role === 'PROTECTOR') {
    return <GuardianStackNavigator />;
  }

  // 2. 피보호자/어르신(WARD)으로 로그인된 경우
  if (isLoggedIn && role === 'WARD') {
    return <SeniorStackNavigator />;
  }

  // 3. 비로그인 상태 (인증 및 회원가입 관련 스크린 제공)
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignupTypeSelect" component={SignupTypeSelectScreen} />
      <AuthStack.Screen name="TermsAgreement" component={TermsAgreementScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="SignupWelcome" component={SignupWelcomeScreen} />
      <AuthStack.Screen name="WardSignup" component={WardSignupScreen} />
      <AuthStack.Screen name="WardSignupWelcome" component={WardSignupWelcomeScreen} />
      <AuthStack.Screen name="LinkAccount" component={LinkAccountScreen} />
      <AuthStack.Screen name="LinkAccountComplete" component={LinkAccountCompleteScreen} />
    </AuthStack.Navigator>
  );
};
