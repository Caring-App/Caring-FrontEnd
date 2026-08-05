import React from 'react';
import { Text, View } from 'react-native';
import { Toggle } from '@shared/ui';

export function SettingsToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between py-3">
      <Text className="text-xl font-pretendard-bold text-text-heading">{label}</Text>
      <Toggle value={value} onValueChange={onValueChange} />
    </View>
  );
}
