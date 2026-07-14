import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

export function GuardianHomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xl font-bold text-text-primary">보호자 홈</Text>
      </View>
    </SafeAreaView>
  );
}
