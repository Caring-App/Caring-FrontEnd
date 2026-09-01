import React from 'react';
import { Pressable, Text, View } from 'react-native';
import BellIcon from '@assets/icons/header/bell.svg';
import { NotificationItem } from '../model';
import { formatNotificationDate } from '../utils';

interface NotificationCardProps {
  notification: NotificationItem;
  onPress?: (notification: NotificationItem) => void;
}

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  return (
    <Pressable
      onPress={() => onPress?.(notification)}
      className="rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <BellIcon width={18} height={18} />
        <Text className="flex-1 text-md font-pretendard-semibold text-text-primary">{notification.title}</Text>
        {!notification.isRead && <View className="h-2 w-2 rounded-full bg-primary" />}
      </View>
      <Text className="mt-2 text-sm font-pretendard-semibold text-text-primary">{notification.content}</Text>
      <Text className="mt-2 text-xs font-pretendard-medium text-text-muted">
        {formatNotificationDate(notification.createdAt)}
      </Text>
    </Pressable>
  );
}
