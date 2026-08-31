import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { WardText } from '@features/ward-management/ui';

export function SeniorScheduleScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 items-center justify-center px-4">
        <WardText size="xl" className="font-bold text-text-primary">
          오늘 일정
        </WardText>
      </View>
    </SafeAreaView>
  );
}
