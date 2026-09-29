import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CloseIcon from '@assets/icons/auth/close.svg';
import { SignupPrimaryButton } from './SignupPrimaryButton';

interface SignupStepLayoutProps {
  title: string;
  description?: string;
  onClose: () => void;
  // X 버튼 접근성 라벨 — 회원가입 외 화면(비밀번호 찾기 등)에서도 이 레이아웃을 써서 호출부에서 바꿀 수 있게 함
  closeLabel?: string;
  buttonLabel: string;
  onPressButton: () => void;
  buttonDisabled?: boolean;
  isLoading?: boolean;
  errorMessage?: string;
  children?: React.ReactNode;
}

// 약관 동의 ~ 기저질환까지 회원가입 단계 화면 공통 뼈대 (Figma 966:5711 등) — 비밀번호 찾기 화면도 같은 스타일로 사용
// X 닫기 버튼 → 제목/설명 → 입력 영역(스크롤) → 하단 고정 주황 버튼
export function SignupStepLayout({
  title,
  description,
  onClose,
  closeLabel = '회원가입 닫기',
  buttonLabel,
  onPressButton,
  buttonDisabled,
  isLoading,
  errorMessage,
  children,
}: SignupStepLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="px-5 pt-4">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center"
            onPress={onClose}
            hitSlop={8}
            accessibilityLabel={closeLabel}
          >
            <CloseIcon width={22} height={22} />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-6 pt-4"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="font-pretendard-bold text-[24px] leading-[32.5px] text-text-signupTitle">{title}</Text>
          {!!description && (
            <Text className="mt-2 font-pretendard text-base leading-[22.75px] text-text-signupDesc">{description}</Text>
          )}
          {children}
        </ScrollView>

        <View className="px-6 pb-6 pt-4">
          {!!errorMessage && <Text className="mb-3 text-center text-xs text-text-danger">{errorMessage}</Text>}
          <SignupPrimaryButton
            label={buttonLabel}
            onPress={onPressButton}
            disabled={buttonDisabled}
            isLoading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
