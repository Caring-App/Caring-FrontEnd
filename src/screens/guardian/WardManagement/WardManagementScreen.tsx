import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/ui';

export function WardManagementScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <AppHeader />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xl font-bold text-text-primary">돌봄대상자 관리</Text>
      </View>
    </SafeAreaView>
  );
}
