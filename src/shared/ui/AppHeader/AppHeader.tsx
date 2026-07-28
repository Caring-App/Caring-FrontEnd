import React from 'react';
import { View, Text, Pressable } from 'react-native';
import LogoIcon from '@assets/icons/header/caring_logo.svg';

interface AppHeaderProps {
  onLogout?: () => void;
}

export const AppHeader = ({ onLogout }: AppHeaderProps) => {
  return (
    <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
      {/* 로고 */}
      <View className="flex-row items-center">
        <LogoIcon width={40} height={40} />
      </View>

      {/* ⭕ 주황색 배경 + 흰색 글씨 로그아웃 버튼 */}
      <Pressable
        onPress={onLogout}
        className="px-3.5 py-1.5 rounded-lg bg-primary active:opacity-80"
      >
        <Text className="text-xs font-bold text-white">로그아웃</Text>
      </Pressable>
    </View>
  );
};