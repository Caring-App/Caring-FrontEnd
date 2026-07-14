import React from 'react';
import { Pressable, View } from 'react-native';
import CaringLogo from '@assets/icons/header/caring_logo.svg';
import BellIcon from '@assets/icons/header/bell.svg';
import NavMenuIcon from '@assets/icons/header/nav-menu.svg';

interface AppHeaderProps {
  onPressBell?: () => void;
  onPressMenu?: () => void;
}

export function AppHeader({ onPressBell, onPressMenu }: AppHeaderProps) {
  return (
    <View className="h-16 flex-row items-center justify-between bg-surface px-4">
      <CaringLogo width={40} height={40} />
      <View className="flex-row items-center gap-4">
        <Pressable onPress={onPressBell} hitSlop={8}>
          <BellIcon width={26} height={26} />
        </Pressable>
        <Pressable onPress={onPressMenu} hitSlop={8}>
          <NavMenuIcon width={26} height={26} />
        </Pressable>
      </View>
    </View>
  );
}
