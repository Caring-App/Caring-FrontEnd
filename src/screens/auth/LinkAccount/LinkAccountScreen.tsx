import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Button } from '@shared/ui';

export function LinkAccountScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 items-center justify-center gap-4 px-4">
        <Text className="text-xl font-bold text-text-primary">고유번호로 연동하기</Text>
        <Button label="연동 시작" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}
