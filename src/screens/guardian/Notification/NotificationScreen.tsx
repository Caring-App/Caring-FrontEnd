import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors } from '@shared/theme/colors';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import GearIcon from '@assets/icons/header/gear.svg';
import { useNotificationStore } from '@features/notification/model';
import { NotificationCard } from '@features/notification/ui';

export function NotificationScreen() {
  const navigation = useNavigation();
  const notifications = useNotificationStore(state => state.notifications);
  const isLoading = useNotificationStore(state => state.isLoading);
  const fetchNotifications = useNotificationStore(state => state.fetchNotifications);
  const markAsRead = useNotificationStore(state => state.markAsRead);

  // 알림 화면에 다시 들어올 때마다 최신 목록으로 갱신.
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications]),
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={20} height={20} />
        </Pressable>
        <Text className="text-xl font-pretendard-bold text-text-primary">알림</Text>
        <Pressable hitSlop={8}>
          <GearIcon width={22} height={22} />
        </Pressable>
      </View>

      {isLoading && notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4"
          contentContainerClassName="gap-4 py-4"
          showsVerticalScrollIndicator={false}>
          {notifications.map(notification => (
            <NotificationCard
              key={notification.notificationId}
              notification={notification}
              onPress={item => markAsRead(item.notificationId)}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
