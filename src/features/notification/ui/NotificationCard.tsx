import React from 'react';
import { Text, View } from 'react-native';
import BellIcon from '@assets/icons/header/bell.svg';
import { AppNotification } from '../model';

export function NotificationCard({ notification }: { notification: AppNotification }) {
  return (
    <View className="rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <BellIcon width={18} height={18} />
        <Text className="text-md font-pretendard-semibold text-text-primary">{notification.title}</Text>
      </View>
      <Text className="mt-2 text-sm font-pretendard-semibold text-text-primary">{notification.body}</Text>
      <Text className="mt-2 text-xs font-pretendard-medium text-text-muted">{notification.date}</Text>
    </View>
  );
}
