import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

export function SeniorScheduleScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xl font-bold text-text-primary">오늘 일정</Text>
      </View>
    </SafeAreaView>
  );
}