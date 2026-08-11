import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSessionStore } from '@shared/store/useSessionStore';
import LoginScreen from '@screens/auth/Login/LoginScreen';
import { SignupTypeSelectScreen } from '@screens/auth/Signup/component/SignupTypeSelectScreen';
import TermsAgreementScreen from '@screens/auth/terms/TermsAgreementScreen';
import SignupScreen from '@screens/auth/Signup/component/SignupScreen';
import { LinkAccountScreen } from '@screens/auth/LinkAccount/LinkAccountScreen';
import { GuardianStackNavigator } from './GuardianStackNavigator';
import { SeniorHomeScreen } from '@screens/senior/Home/SeniorHomeScreen';
import { SeniorScheduleScreen } from '@screens/senior/Schedule/SeniorScheduleScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const isLoggedIn = useSessionStore(state => state.isLoggedIn);
  const role = useSessionStore(state => state.role);

  // 1. 보호자(PROTECTOR)로 로그인된 경우
  if (isLoggedIn && role === 'PROTECTOR') {
    return <GuardianStackNavigator />;
  }

  // 2. 피보호자/어르신(WARD)으로 로그인된 경우
  if (isLoggedIn && role === 'WARD') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SeniorHome" component={SeniorHomeScreen} />
        <Stack.Screen name="SeniorSchedule" component={SeniorScheduleScreen} />
      </Stack.Navigator>
    );
  }

  // 3. 비로그인 상태 (인증 및 회원가입 관련 스크린 제공)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignupTypeSelect" component={SignupTypeSelectScreen} />
      <Stack.Screen name="TermsAgreement" component={TermsAgreementScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="LinkAccount" component={LinkAccountScreen} />
    </Stack.Navigator>
  );
};