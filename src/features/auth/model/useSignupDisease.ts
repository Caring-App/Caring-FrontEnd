import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '@app/navigation/types';
import { useSignupDraftStore } from './useSignupDraftStore';
import { useSignupSubmit } from './useSignupSubmit';

// 돌봄대상자 회원가입 마지막 단계(Figma 970:7757) — 기저질환은 중복 선택 가능, 최소 1개 이상 선택해야 가입 가능
export function useSignupDisease() {
  const navigation = useNavigation<AuthStackNavigationProp>();
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

  return { selectedDiseases, toggleDisease, canProceed: selectedDiseases.length > 0, handleNext, isSubmitting, submitError };
}
