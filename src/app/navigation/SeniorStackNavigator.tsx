import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogoutConfirmModal } from '@features/mypage/ui';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, "WARD로 로그인해있는 동안" 위치 보고를
// 켜고 꺼야 하는데 그 생명주기를 이 네비게이터(RootNavigator가 role===WARD && isLoggedIn일 때만
// 마운트함)가 가장 정확히 갖고 있어 의도적으로 참조함(순환참조 없음).
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
