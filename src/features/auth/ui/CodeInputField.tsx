import React from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { colors } from '@shared/theme/colors';

// "연동 코드" 표시/입력란 공용 UI — 라벨 중앙정렬 + 우측 버튼(복사/붙여넣기) + 코드 텍스트박스
interface CodeInputFieldProps {
  label?: string;
  value: string;
  onChangeText?: (value: string) => void;
  editable?: boolean;
  buttonLabel: string;
  onButtonPress: () => void;
  placeholder?: string;
  autoCapitalize?: TextInputProps['autoCapitalize'];
}

export function CodeInputField({
  label = '연동 코드',
  value,
  onChangeText,
  editable = true,
  buttonLabel,
  onButtonPress,
  placeholder,
  autoCapitalize,
}: CodeInputFieldProps) {
  return (
    <View className="rounded-card border border-border p-4">
      <View className="relative flex-row items-center justify-center">
        <Text className="font-pretendard-semibold text-lg text-text-body">{label}</Text>
        <TouchableOpacity
          className="absolute right-0 rounded-lg bg-primary px-3 py-1.5"
          onPress={onButtonPress}
          activeOpacity={0.8}
        >
          <Text className="font-pretendard-semibold text-sm text-white">{buttonLabel}</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        className="mt-2 h-[44px] rounded-md border border-border-input px-4 text-center font-pretendard-semibold text-lg text-text-body"
        style={{ letterSpacing: 1 }}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}
