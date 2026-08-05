import React from 'react';
import { Text } from 'react-native';

export function FormLabel({ children }: { children: string }) {
  return <Text className="mb-2 font-pretendard-semibold text-lg text-text-body">{children}</Text>;
}
