import React from 'react';
import { Text } from 'react-native';

export function FormLabel({ children, className }: { children: string; className?: string }) {
  return <Text className={className ?? 'mb-2 font-pretendard-semibold text-lg text-text-body'}>{children}</Text>;
}
