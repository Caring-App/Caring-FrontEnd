import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSessionStore } from '@shared/store/useSessionStore';
import LoginScreen from '@screens/auth/Login/LoginScreen';
import SignupScreen from '@screens/auth/Signup/SignupScreen';
import { LinkAccountScreen } from '@screens/auth/LinkAccount/LinkAccountScreen';
import { GuardianStackNavigator } from './GuardianStackNavigator';
import SeniorHomeScreen from '../../screens/senior/SeniorHomeScreen';
import { SeniorScheduleScreen } from '@screens/senior/Schedule/SeniorScheduleScreen';

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
        <Stack.Screen name="SeniorHome" component={SeniorHomeScreen} />
        <Stack.Screen name="SeniorSchedule" component={SeniorScheduleScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="LinkAccount" component={LinkAccountScreen} />
    </Stack.Navigator>
  );
}
