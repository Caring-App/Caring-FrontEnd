import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import HomeIcon from '@assets/icons/under_nav/home.svg';
import UsersIcon from '@assets/icons/under_nav/users.svg';
import MypageIcon from '@assets/icons/under_nav/mypage.svg';

const TAB_ICONS: Record<string, React.FC<{ width: number; height: number }>> = {
  Home: HomeIcon,
  WardManagement: UsersIcon,
  Profile: MypageIcon,
};

const TAB_LABELS: Record<string, string> = {
  Home: '홈',
  WardManagement: '돌봄대상자 관리',
  Profile: '마이페이지',
};

export function GuardianBottomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View className="flex-row border-t border-border bg-surface pb-2 pt-2">
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const Icon = TAB_ICONS[route.name];

        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            className="flex-1 items-center justify-center gap-1 py-1">
            <Icon width={26} height={26} />
            <Text
              className={`text-xs ${isFocused ? 'font-bold text-text-primary' : 'text-text-muted'}`}>
              {TAB_LABELS[route.name]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
