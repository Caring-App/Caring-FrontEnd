import React from 'react';
import { Pressable, Text } from 'react-native';

export function MenuListItem({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable className="py-3" onPress={onPress}>
      <Text className="text-xl font-pretendard-bold text-text-heading">{label}</Text>
    </Pressable>
  );
}
