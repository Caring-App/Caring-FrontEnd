import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSessionStore } from '@shared/store/useSessionStore';
import LoginScreen from '@screens/auth/Login/LoginScreen';
import SignupScreen from '@screens/auth/Signup/SignupScreen';
import { LinkAccountScreen } from '@screens/auth/LinkAccount/LinkAccountScreen';
import { GuardianHomeScreen } from '@screens/guardian/Home/GuardianHomeScreen';
import { MapScreen } from '@screens/guardian/Map/MapScreen';
import { MedicationScreen } from '@screens/guardian/Medication/MedicationScreen';
import { ScheduleScreen } from '@screens/guardian/Schedule/ScheduleScreen';
import { ProfileScreen } from '@screens/guardian/Profile/ProfileScreen';
import { SeniorHomeScreen } from '@screens/senior/Home/SeniorHomeScreen';
import { SeniorScheduleScreen } from '@screens/senior/Schedule/SeniorScheduleScreen';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const isLoggedIn = useSessionStore(state => state.isLoggedIn);
  const role = useSessionStore(state => state.role);

  if (isLoggedIn && role === 'PROTECTOR') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GuardianHome" component={GuardianHomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Medication" component={MedicationScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    );
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
