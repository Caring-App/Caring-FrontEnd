import { useState } from 'react';
import { registerWardApi } from '@features/auth/api';
import { loginAfterRegister } from '@features/auth/utils';
import { logApiError } from '@shared/api';
import { useSignupFormBase } from './useSignupFormBase';

export default function useWardSignUp(navigation: any) {
  const base = useSignupFormBase();
  const { name, phone, authCode, password, passwordConfirm, address, isFormValid: isBaseFormValid } = base;
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 기저 질환은 최소 1개 이상 선택해야 함 (소셜 회원가입의 useSocialAdditionalInfo와 동일 조건)
  const isFormValid = isBaseFormValid && selectedDiseases.length > 0;

  // 기저 질환은 중복 선택 가능 (Figma 504:13234)
  const toggleDisease = (disease: string) => {
    setSelectedDiseases((prev) =>
      prev.includes(disease) ? prev.filter((item) => item !== disease) : [...prev, disease],
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;
    setSubmitError('');
    setIsSubmitting(true);

    try {
      await registerWardApi({
        name,
        phone,
        authNumber: authCode,
        password,
        passwordCheck: passwordConfirm,
        address,
        diseases: selectedDiseases,
      });
    } catch (error) {
      logApiError('돌봄대상자 회원가입 실패:', error);
      setSubmitError('회원가입에 실패했습니다. 입력하신 정보를 다시 확인해 주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      await loginAfterRegister(phone, password, 'WARD');
      navigation.navigate('WardSignupWelcome', { userName: name });
    } catch (error) {
      logApiError('회원가입 후 자동 로그인 실패:', error);
      setSubmitError('가입은 완료됐지만 로그인에 실패했어요. 로그인 화면에서 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...base,
    form: { name, phone, authCode, password, passwordConfirm, address, selectedDiseases },
    toggleDisease,
    handleSubmit,
    isFormValid,
    isSubmitting,
    submitError,
  };
}
