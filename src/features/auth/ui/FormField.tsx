import React from 'react';
import { View, Text } from 'react-native';

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
