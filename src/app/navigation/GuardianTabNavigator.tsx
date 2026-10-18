import React from 'react';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNotificationOpen, useNotificationStore } from '@features/notification/model';
import { GuardianStackParamList, GuardianTabParamList } from './types';
import { GuardianBottomTabBar } from './GuardianBottomTabBar';
import { GuardianHomeScreen } from '@screens/guardian/Home/GuardianHomeScreen';
import { WardManagementScreen } from '@screens/guardian/WardManagement/WardManagementScreen';
import { ProfileScreen } from '@screens/guardian/Profile/ProfileScreen';

const Tab = createBottomTabNavigator<GuardianTabParamList>();

export function GuardianTabNavigator({ navigation }: NativeStackScreenProps<GuardianStackParamList, 'Tabs'>) {
  // 보호자가 시스템 알림(복약 완료·미응답)을 눌러 앱을 열면 알림 목록으로 이동 — 보호자 알림엔 어느 어르신/항목인지
  // 담긴 데이터가 없어서 목록으로 보냄. 탭 화면은 보호자 스택의 첫 화면이라 로그인해 있는 동안 항상 떠 있어서 여기서 처리
  // (어르신은 화면이 사실상 홈 하나라 알림을 누르면 그대로 홈이 열림)
  useNotificationOpen(() => {
    navigation.navigate('Notification');
    // 이미 알림 목록을 보고 있었으면 화면 포커스가 안 바뀌어 새로 불러오지 않으므로 직접 다시 받아옴
    useNotificationStore.getState().fetchNotifications();
  });

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
      <Tab.Screen name="Home" component={GuardianHomeScreen} />
      <Tab.Screen name="WardManagement" component={WardManagementScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function renderTabBar(props: BottomTabBarProps) {
  return <GuardianBottomTabBar {...props} />;
}
