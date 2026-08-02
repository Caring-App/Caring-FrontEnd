import React from 'react';
import { View, Text, Pressable } from 'react-native';
import LogoIcon from '@assets/icons/header/caring_logo.svg';
import BellIcon from '@assets/icons/header/bell.svg';
import NavMenuIcon from '@assets/icons/header/nav-menu.svg';

interface AppHeaderProps {
  onLogout?: () => void;
  onPressBell?: () => void;
  onPressMenu?: () => void;
}

export const AppHeader = ({ onLogout, onPressBell, onPressMenu }: AppHeaderProps) => {
  return (
    <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
      {/* 로고 */}
      <View className="flex-row items-center">
        <LogoIcon width={40} height={40} />
      </View>

      {/* 우측 아이콘 및 로그아웃 버튼 영역 */}
      <View className="flex-row items-center gap-3">
        {/* 알림 버튼 (선택적) */}
        {onPressBell && (
          <Pressable onPress={onPressBell} hitSlop={8}>
            <BellIcon width={26} height={26} />
          </Pressable>
        )}

        {/* 메뉴 버튼 (선택적) */}
        {onPressMenu && (
          <Pressable onPress={onPressMenu} hitSlop={8}>
            <NavMenuIcon width={26} height={26} />
          </Pressable>
        )}

        {/* 주황색 배경 + 흰색 글씨 로그아웃 버튼 */}
        {onLogout && (
          <Pressable
            onPress={onLogout}
            className="px-3.5 py-1.5 rounded-lg bg-primary active:opacity-80"
          >
            <Text className="text-xs font-bold text-white">로그아웃</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};