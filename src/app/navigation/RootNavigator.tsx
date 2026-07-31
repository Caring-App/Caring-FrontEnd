import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSessionStore } from '../../shared/store/useSessionStore';
import LoginScreen from '../../screens/auth/Login/LoginScreen';
import SignupScreen from '../../screens/auth/Signup/component/SignupScreen';
import { SignupTypeSelectScreen } from '../../screens/auth/Signup/component/SignupTypeSelectScreen';
import TermsAgreementScreen from '../../screens/auth/terms/TermsAgreementScreen';
import { LinkAccountScreen } from '../../screens/auth/LinkAccount/LinkAccountScreen';
import { GuardianStackNavigator } from './GuardianStackNavigator';
import { SeniorHomeScreen } from '../../screens/senior/Home/SeniorHomeScreen';
import { SeniorScheduleScreen } from '../../screens/senior/Schedule/SeniorScheduleScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignupTypeSelect" component={SignupTypeSelectScreen} />
      <Stack.Screen name="TermsAgreement" component={TermsAgreementScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="LinkAccount" component={LinkAccountScreen} />
      <Stack.Screen name="GuardianMain" component={GuardianStackNavigator} />
      <Stack.Screen name="SeniorHome" component={SeniorHomeScreen} />
      <Stack.Screen name="SeniorSchedule" component={SeniorScheduleScreen} />
    </Stack.Navigator>
  );
};