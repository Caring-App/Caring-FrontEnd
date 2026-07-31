import React from 'react';
import { Text, TextInput, View } from 'react-native';

export function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'phone-pad';
}) {
  return (
    <View className="gap-2">
      <Text className="text-lg font-pretendard-semibold text-text-body">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6C757D"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        className="rounded-[6px] border border-border-input px-3 py-2 text-lg text-text-body"
      />
    </View>
  );
}
