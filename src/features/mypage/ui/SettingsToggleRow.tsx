import React from 'react';
import { Switch, Text, View } from 'react-native';
import { colors } from '@shared/theme/colors';

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
      {/* Switch는 className을 지원하지 않아 트랙 색상을 직접 지정(Figma 62:7438 트랙 색상과 동일한 값) */}
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.switchTrackOff, true: colors.primary }}
        thumbColor={colors.surface}
      />
    </View>
  );
}
