import React from 'react';
import { Pressable, Text } from 'react-native';

export function DetailLinkText({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Text className="border-b border-border-link text-[10px] font-pretendard-medium text-text-link">
        자세히 보기 {'>'}
      </Text>
    </Pressable>
  );
}
