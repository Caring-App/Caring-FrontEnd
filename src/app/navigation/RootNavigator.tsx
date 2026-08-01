import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSessionStore } from '@shared/store/useSessionStore';
import LoginScreen from '@screens/auth/Login/LoginScreen';
import SignupScreen from '@screens/auth/Signup/SignupScreen';
import { LinkAccountScreen } from '@screens/auth/LinkAccount/LinkAccountScreen';
import { GuardianStackNavigator } from './GuardianStackNavigator';
// 👇 어르신 메인 화면 컴포넌트 경로를 올바른 메인 화면으로 지정해주세요 (예: SeniorHomeTabs 또는 SeniorMainScreen 등)
import SeniorHomeScreen from '@screens/senior/Home/SeniorHomeScreen'; 

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const isLoggedIn = useSessionStore(state => state.isLoggedIn);
  const role = useSessionStore(state => state.role);

  if (isLoggedIn && role === 'PROTECTOR') {
    return <GuardianStackNavigator />;
  }

  if (isLoggedIn && role === 'WARD') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 어르신으로 진입 시 보여질 메인 화면 컴포넌트 연결 */}
        <Stack.Screen name="SeniorHome" component={SeniorHomeScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component= {SignupScreen} />
      <Stack.Screen name="LinkAccount" component={LinkAccountScreen} />
    </Stack.Navigator>
  );
}