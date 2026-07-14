import React from 'react';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GuardianTabParamList } from './types';
import { GuardianBottomTabBar } from './GuardianBottomTabBar';
import { GuardianHomeScreen } from '@screens/guardian/Home/GuardianHomeScreen';
import { WardManagementScreen } from '@screens/guardian/WardManagement/WardManagementScreen';
import { ProfileScreen } from '@screens/guardian/Profile/ProfileScreen';

const Tab = createBottomTabNavigator<GuardianTabParamList>();

export function GuardianTabNavigator() {
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
