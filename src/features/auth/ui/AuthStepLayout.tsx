import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CloseIcon from '@assets/icons/auth/close.svg';
import { AuthPrimaryButton } from './AuthPrimaryButton';

interface AuthStepLayoutProps {
  title: string;
  description?: string;
  onClose: () => void;
  // X 버튼 접근성 라벨 — 화면마다 무엇을 닫는지 알려주도록 호출부에서 지정 가능
  closeLabel?: string;
  buttonLabel: string;
  onPressButton: () => void;
  buttonDisabled?: boolean;
  isLoading?: boolean;
  errorMessage?: string;
  children?: React.ReactNode;
}

// 인증 단계 화면 공통 뼈대 (Figma 966:5711 등) — 회원가입 약관~기저질환, 비밀번호 찾기에서 사용
// X 닫기 버튼 → 제목/설명 → 입력 영역(스크롤) → 하단 고정 주황 버튼
export function AuthStepLayout({
  title,
  description,
  onClose,
  closeLabel = '닫기',
  buttonLabel,
  onPressButton,
  buttonDisabled,
  isLoading,
  errorMessage,
  children,
}: AuthStepLayoutProps) {
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
          <Text className="font-pretendard-bold text-[24px] leading-[32.5px] text-text-authTitle">{title}</Text>
          {!!description && (
            <Text className="mt-2 font-pretendard text-base leading-[22.75px] text-text-authDesc">{description}</Text>
          )}
          {children}
        </ScrollView>

        <View className="px-6 pb-6 pt-4">
          {!!errorMessage && <Text className="mb-3 text-center text-xs text-text-danger">{errorMessage}</Text>}
          <AuthPrimaryButton
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
