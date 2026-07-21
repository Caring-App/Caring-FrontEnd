import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import GearIcon from '@assets/icons/header/gear.svg';
import { MOCK_NOTIFICATIONS } from '@features/notification/model';
import { NotificationCard } from '@features/notification/ui';

export function NotificationScreen() {
  const navigation = useNavigation();

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

      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="gap-4 py-4"
        showsVerticalScrollIndicator={false}>
        {MOCK_NOTIFICATIONS.map(notification => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
