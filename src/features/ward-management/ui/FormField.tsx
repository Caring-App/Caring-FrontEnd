import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { colors } from '@shared/theme/colors';

export function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'phone-pad';
}) {
  return (
    <View className="gap-2">
      <Text className="text-md font-pretendard-semibold text-text-strong">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        keyboardType={keyboardType}
        className="rounded-[6px] border border-border-input px-3 py-2 text-base text-text-primary"
      />
    </View>
  );
}
