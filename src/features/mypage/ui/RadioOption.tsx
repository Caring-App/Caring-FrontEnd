import React from 'react';
import { Pressable, Text, View } from 'react-native';

export function RadioOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable className="flex-row items-center gap-2 py-1.5" onPress={onPress} hitSlop={4}>
      <View className="h-[17px] w-[17px] items-center justify-center rounded-full border border-border-input">
        {selected && <View className="h-[9px] w-[9px] rounded-full bg-primary" />}
      </View>
      <Text className="text-xs font-pretendard-medium text-text-muted">{label}</Text>
    </Pressable>
  );
}
