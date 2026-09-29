import React from 'react';
import { Text, View } from 'react-native';
import { useSignupDisease, useSignupExit } from '@features/auth/model';
import { AuthStepLayout, DiseaseSelector } from '@features/auth/ui';

// 기저질환 선택 (Figma 970:7757) — 돌봄대상자 회원가입의 마지막 단계
export default function SignupDiseaseScreen() {
  const { selectedDiseases, toggleDisease, canProceed, handleNext, isSubmitting, submitError } = useSignupDisease();
  const handleClose = useSignupExit();

  return (
    <AuthStepLayout
      title="기저질환을 선택해주세요"
      description="해당되는 기저질환을 모두 선택해 주세요. (복수 선택 가능)"
      onClose={handleClose}
      buttonLabel="다음"
      onPressButton={handleNext}
      buttonDisabled={!canProceed}
      isLoading={isSubmitting}
      errorMessage={submitError}
    >
      <Text className="mt-6 font-pretendard-bold text-sm tracking-[0.65px] text-text-sectionLabel">기저 질환 선택</Text>
      <View className="mt-4">
        <DiseaseSelector selectedDiseases={selectedDiseases} onToggle={toggleDisease} />
      </View>
    </AuthStepLayout>
  );
}
