import React from 'react';
import { Pressable, Text } from 'react-native';

export function AddButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-1 rounded-card border border-border bg-surface px-3 py-1.5">
      <Text className="text-xs font-semibold text-text-strong">+ {label}</Text>
    </Pressable>
  );
}
