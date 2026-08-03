import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GuardianStackParamList } from './types';
import { GuardianTabNavigator } from './GuardianTabNavigator';
import { GuardianMenuDrawer } from '@features/guardian-menu/ui';
import { LogoutConfirmModal } from '@features/mypage/ui';
import { MapScreen } from '@screens/guardian/Map/MapScreen';
import { MedicationScreen } from '@screens/guardian/Medication/MedicationScreen';
import { ScheduleScreen } from '@screens/guardian/Schedule/ScheduleScreen';
import { NotificationScreen } from '@screens/guardian/Notification/NotificationScreen';
import { WelfareFacilityListScreen } from '@screens/guardian/WelfareFacilities/WelfareFacilityListScreen';
import { WelfareFacilityDetailScreen } from '@screens/guardian/WelfareFacilities/WelfareFacilityDetailScreen';
import { SettingsScreen } from '@screens/guardian/Settings/SettingsScreen';
import { WithdrawalScreen } from '@screens/guardian/Withdrawal/WithdrawalScreen';
import { InquiryScreen } from '@screens/guardian/Inquiry/InquiryScreen';
import { InquiryChatScreen } from '@screens/guardian/Inquiry/InquiryChatScreen';
import { FaqScreen } from '@screens/guardian/Faq/FaqScreen';
import { PolicyScreen } from '@screens/guardian/Policy/PolicyScreen';

const Stack = createNativeStackNavigator<GuardianStackParamList>();

export function GuardianStackNavigator() {
  return (
    <View className="flex-1">
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={GuardianTabNavigator} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Medication" component={MedicationScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="WelfareFacilities" component={WelfareFacilityListScreen} />
        <Stack.Screen name="WelfareFacilityDetail" component={WelfareFacilityDetailScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Withdrawal" component={WithdrawalScreen} />
        <Stack.Screen name="Inquiry" component={InquiryScreen} />
        <Stack.Screen name="InquiryChat" component={InquiryChatScreen} />
        <Stack.Screen name="Faq" component={FaqScreen} />
        <Stack.Screen name="Policy" component={PolicyScreen} />
      </Stack.Navigator>
      <GuardianMenuDrawer />
      <LogoutConfirmModal />
    </View>
  );
}
