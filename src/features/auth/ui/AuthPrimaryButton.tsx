import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { colors } from '@shared/theme/colors';

interface AuthPrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

// 회원가입 리뉴얼 하단 주황 버튼 (Figma 966:5764 PrimaryButton, 60px / radius 12)
export function AuthPrimaryButton({ label, onPress, disabled = false, isLoading = false }: AuthPrimaryButtonProps) {
  const isInactive = disabled || isLoading;

  return (
    <TouchableOpacity
      className={`h-[60px] w-full items-center justify-center rounded-card ${
        disabled ? 'bg-authButtonDisabled' : 'bg-primary'
      }`}
      onPress={onPress}
      disabled={isInactive}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.surface} />
      ) : (
        <Text className={`font-pretendard-bold text-lg ${disabled ? 'text-text-authDesc' : 'text-white'}`}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
