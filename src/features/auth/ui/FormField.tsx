import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@shared/theme/colors';

// 회원가입 폼 입력창 공용 스타일 (SignupScreen, WardSignupScreen)
export const FORM_INPUT_CLASSNAME =
  'rounded-md border border-border-input bg-surface px-3.5 py-2 font-pretendard-light text-lg text-text-body';
export const FORM_INPUT_PLACEHOLDER_COLOR = colors.textPlaceholder;

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <View className="mb-4">
      <Text className="mb-2 font-pretendard-semibold text-lg text-text-body">{label}</Text>
      {children}
    </View>
  );
}
