import { useState } from 'react';
import { registerProtectorApi } from '@features/auth/api';
import { loginAfterRegister } from '@features/auth/utils';
import { logApiError } from '@shared/api';
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

    let protectorCode: string;
    try {
      ({ protectorCode } = await registerProtectorApi({
        name,
        phone,
        authNumber: authCode,
        password,
        passwordCheck: passwordConfirm,
        address,
      }));
    } catch (error) {
      logApiError('보호자 회원가입 실패:', error);
      setSubmitError('회원가입에 실패했습니다. 입력하신 정보를 다시 확인해 주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      await loginAfterRegister(phone, password, 'PROTECTOR');
      navigation.navigate('SignupWelcome', { userName: name, protectorCode });
    } catch (error) {
      logApiError('회원가입 후 자동 로그인 실패:', error);
      setSubmitError('가입은 완료됐지만 로그인에 실패했어요. 로그인 화면에서 다시 시도해 주세요.');
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
