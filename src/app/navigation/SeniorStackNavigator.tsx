import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogoutConfirmModal } from '@features/mypage/ui';
// "WARD로 로그인해있는 동안"이 곧 이 네비게이터의 생명주기(RootNavigator가 role===WARD && isLoggedIn일
// 때만 마운트함)라서, 위치 보고를 켜고 끄는 시점을 여기서 관리함.
import { useWardLocationReporting } from '@features/location/model';
import { SeniorHomeScreen } from '@screens/senior/Home/SeniorHomeScreen';
import { SeniorScheduleScreen } from '@screens/senior/Schedule/SeniorScheduleScreen';
import { SeniorStackParamList } from './types';

const Stack = createNativeStackNavigator<SeniorStackParamList>();

export function SeniorStackNavigator() {
  useWardLocationReporting();

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
