import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { useSignupDraftStore, useSignupSubmit } from '@features/auth/model';
import { DiseaseSelector, AuthStepLayout } from '@features/auth/ui';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignupDisease'>;

// 기저질환 선택 (Figma 970:7757) — 돌봄대상자 회원가입의 마지막 단계. 최소 1개 이상 선택해야 가입 가능
export default function SignupDiseaseScreen({ navigation }: Props) {
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>(() => useSignupDraftStore.getState().diseases);
  const { submit, isSubmitting, submitError } = useSignupSubmit(navigation);

  const toggleDisease = (disease: string) => {
    setSelectedDiseases(prev => (prev.includes(disease) ? prev.filter(item => item !== disease) : [...prev, disease]));
  };

  const handleNext = () => {
    if (selectedDiseases.length === 0) return;
    useSignupDraftStore.getState().setDiseases(selectedDiseases);
    submit();
  };

  const handleClose = () => {
    useSignupDraftStore.getState().reset();
    navigation.popToTop();
  };

  return (
    <AuthStepLayout
      title="기저질환을 선택해주세요"
      description="해당되는 기저질환을 모두 선택해 주세요. (복수 선택 가능)"
      onClose={handleClose}
      buttonLabel="다음"
      onPressButton={handleNext}
      buttonDisabled={selectedDiseases.length === 0}
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
