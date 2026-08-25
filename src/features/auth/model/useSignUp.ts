import { useState } from 'react';
import { loginApi, registerProtectorApi } from '@features/auth/api';
import { logApiError, setTokens } from '@shared/api';
import { useSessionStore } from '@shared/store/useSessionStore';
import { useSignupFormBase } from './useSignupFormBase';

export default function useSignUp(navigation: any) {
  const base = useSignupFormBase();
  const { name, phone, authCode, password, passwordConfirm, address, isFormValid } = base;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const { protectorCode } = await registerProtectorApi({
        name,
        phone,
        authNumber: authCode,
        password,
        passwordCheck: passwordConfirm,
        address,
      });

      // 회원가입 응답에는 토큰이 없으므로 방금 만든 계정으로 바로 로그인해 토큰을 발급받음
      const loginResult = await loginApi({ phone, password });
      await setTokens(loginResult.accessToken, loginResult.refreshToken);
      useSessionStore.getState().setPendingProfile('PROTECTOR', {
        memberId: loginResult.memberId,
        name: loginResult.name,
        nickname: loginResult.nickname,
      });

      navigation.navigate('SignupWelcome', { userName: name, protectorCode });
    } catch (error) {
      logApiError('보호자 회원가입 실패:', error);
      setSubmitError('회원가입에 실패했습니다. 입력하신 정보를 다시 확인해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...base,
    form: { name, phone, authCode, password, passwordConfirm, address },
    handleSubmit,
    isSubmitting,
    submitError,
  };
}
