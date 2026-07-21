import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GuardianStackParamList } from './types';
import { GuardianTabNavigator } from './GuardianTabNavigator';
import { MapScreen } from '@screens/guardian/Map/MapScreen';
import { MedicationScreen } from '@screens/guardian/Medication/MedicationScreen';
import { ScheduleScreen } from '@screens/guardian/Schedule/ScheduleScreen';
import { NotificationScreen } from '@screens/guardian/Notification/NotificationScreen';

const Stack = createNativeStackNavigator<GuardianStackParamList>();

export function GuardianStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={GuardianTabNavigator} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Medication" component={MedicationScreen} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
}
