import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogoutConfirmModal } from '@features/mypage/ui';
import { SeniorHomeScreen } from '@screens/senior/Home/SeniorHomeScreen';
import { SeniorScheduleScreen } from '@screens/senior/Schedule/SeniorScheduleScreen';
import { SeniorStackParamList } from './types';

const Stack = createNativeStackNavigator<SeniorStackParamList>();

export function SeniorStackNavigator() {
  return (
    <View className="flex-1">
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SeniorHome" component={SeniorHomeScreen} />
        <Stack.Screen name="SeniorSchedule" component={SeniorScheduleScreen} />
      </Stack.Navigator>
      <LogoutConfirmModal />
    </View>
  );
}
