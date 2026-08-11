import React from 'react';
import { View } from 'react-native';
import { FormLabel } from './FormLabel';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  // 화면마다 필드 간격/라벨 스타일이 의도적으로 다름(예: 마이페이지=내 정보, 돌봄대상자 관리=대상자 정보)
  // 필요한 곳만 오버라이드해서 쓰고, 기본값은 회원가입 폼 기준
  containerClassName?: string;
  labelClassName?: string;
}

export function FormField({ label, children, containerClassName = 'mb-4', labelClassName }: FormFieldProps) {
  return (
    <View className={containerClassName}>
      <FormLabel className={labelClassName}>{label}</FormLabel>
      {children}
    </View>
  );
}
