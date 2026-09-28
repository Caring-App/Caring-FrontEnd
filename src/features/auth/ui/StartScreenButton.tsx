import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface StartScreenButtonProps {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

// 시작 화면(오렌지 배경)의 흰색 알약형 버튼 (Figma 964:5412) — 카카오/네이버/전화번호 로그인, 회원가입
export function StartScreenButton({ label, onPress, icon, disabled }: StartScreenButtonProps) {
  return (
    <TouchableOpacity
      className="w-full flex-row items-center justify-center gap-3 rounded-full bg-surface py-[17px]"
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon}
      <Text className="font-pretendard-bold text-lg leading-[24px] text-text-signupTitle">{label}</Text>
    </TouchableOpacity>
  );
}
