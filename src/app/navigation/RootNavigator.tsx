import React, { useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSessionStore } from '@shared/store/useSessionStore';
import SplashScreen from '@screens/auth/Splash/SplashScreen';
import LoginScreen from '@screens/auth/Login/LoginScreen';
import PhoneLoginScreen from '@screens/auth/Login/PhoneLoginScreen';
import ResetPasswordScreen from '@screens/auth/ResetPassword/ResetPasswordScreen';
import { SignupTypeSelectScreen } from '@screens/auth/Signup/SignupTypeSelectScreen';
import TermsAgreementScreen from '@screens/auth/terms/TermsAgreementScreen';
import SignupIdentityScreen from '@screens/auth/Signup/SignupIdentityScreen';
import SignupVerifyCodeScreen from '@screens/auth/Signup/SignupVerifyCodeScreen';
import SignupPasswordScreen from '@screens/auth/Signup/SignupPasswordScreen';
import SignupAddressScreen from '@screens/auth/Signup/SignupAddressScreen';
import SignupDiseaseScreen from '@screens/auth/Signup/SignupDiseaseScreen';
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
  // 스플래시는 앱 실행 직후 한 번만 — 로그인했다가 로그아웃해서 인증 스택이 다시 마운트될 땐 시작 화면부터
  const hasLoggedInRef = useRef(false);
  if (isLoggedIn) {
    hasLoggedInRef.current = true;
  }

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
    <AuthStack.Navigator
      initialRouteName={hasLoggedInRef.current ? 'Login' : 'Splash'}
      screenOptions={{ headerShown: false }}
    >
      <AuthStack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ animation: 'fade' }} />
      <AuthStack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <AuthStack.Screen name="SignupTypeSelect" component={SignupTypeSelectScreen} />
      <AuthStack.Screen name="TermsAgreement" component={TermsAgreementScreen} />
      <AuthStack.Screen name="SignupIdentity" component={SignupIdentityScreen} />
      <AuthStack.Screen name="SignupVerifyCode" component={SignupVerifyCodeScreen} />
      <AuthStack.Screen name="SignupPassword" component={SignupPasswordScreen} />
      <AuthStack.Screen name="SignupAddress" component={SignupAddressScreen} />
      <AuthStack.Screen name="SignupDisease" component={SignupDiseaseScreen} />
      <AuthStack.Screen name="SignupWelcome" component={SignupWelcomeScreen} />
      <AuthStack.Screen name="WardSignupWelcome" component={WardSignupWelcomeScreen} />
      <AuthStack.Screen name="LinkAccount" component={LinkAccountScreen} />
      <AuthStack.Screen name="LinkAccountComplete" component={LinkAccountCompleteScreen} />
    </AuthStack.Navigator>
  );
};
