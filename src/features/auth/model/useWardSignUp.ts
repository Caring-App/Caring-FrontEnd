import { useState } from 'react';
import { loginApi, registerWardApi } from '@features/auth/api';
import { logApiError, setTokens } from '@shared/api';
import { useSessionStore } from '@shared/store/useSessionStore';
import { useSignupFormBase } from './useSignupFormBase';

export default function useWardSignUp(navigation: any) {
  const base = useSignupFormBase();
  const { name, phone, authCode, password, passwordConfirm, address, isFormValid } = base;
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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

      // 회원가입 응답에는 토큰이 없으므로 방금 만든 계정으로 바로 로그인해 토큰을 발급받음
      const loginResult = await loginApi({ phone, password });
      await setTokens(loginResult.accessToken, loginResult.refreshToken);
      useSessionStore.getState().setPendingProfile('WARD', {
        memberId: loginResult.memberId,
        name: loginResult.name,
        nickname: loginResult.nickname,
      });

      navigation.navigate('WardSignupWelcome', { userName: name });
    } catch (error) {
      logApiError('돌봄대상자 회원가입 실패:', error);
      setSubmitError('회원가입에 실패했습니다. 입력하신 정보를 다시 확인해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...base,
    form: { name, phone, authCode, password, passwordConfirm, address, selectedDiseases },
    toggleDisease,
    handleSubmit,
    isSubmitting,
    submitError,
  };
}
