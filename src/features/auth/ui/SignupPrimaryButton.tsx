import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { colors } from '@shared/theme/colors';

interface SignupPrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

// 회원가입 리뉴얼 하단 주황 버튼 (Figma 966:5764 PrimaryButton, 60px / radius 12)
export function SignupPrimaryButton({ label, onPress, disabled = false, isLoading = false }: SignupPrimaryButtonProps) {
  const isInactive = disabled || isLoading;

  return (
    <TouchableOpacity
      className={`h-[60px] w-full items-center justify-center rounded-card ${
        disabled ? 'bg-signupButtonDisabled' : 'bg-primary'
      }`}
      onPress={onPress}
      disabled={isInactive}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.surface} />
      ) : (
        <Text className={`font-pretendard-bold text-lg ${disabled ? 'text-text-signupDesc' : 'text-white'}`}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
