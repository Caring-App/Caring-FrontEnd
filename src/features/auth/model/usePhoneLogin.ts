import { useState } from 'react';
import { loginApi } from '@features/auth/api';
import { logApiError, setTokens } from '@shared/api';
import { useSessionStore } from '@shared/store/useSessionStore';
import { normalizePhoneDigits } from '../utils/phone';

// 전화번호 + 비밀번호 로그인. 전화번호는 숫자만 보관·전송(회원가입 때 숫자만 저장하므로 맞춤)
export function usePhoneLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const isFilled = !!phone && !!password;

  // 성공하면 세션이 로그인 상태가 되어 RootNavigator가 역할별 화면으로 전환함
  const handleLogin = async () => {
    if (!isFilled || isSubmitting) return;
    setLoginError('');
    setIsSubmitting(true);
    try {
      const result = await loginApi({ phone, password });
      await setTokens(result.accessToken, result.refreshToken);
      useSessionStore.getState().login(result.role, {
        memberId: result.memberId,
        name: result.name,
        nickname: result.nickname,
        authLevel: result.authLevel,
      });
    } catch (error) {
      logApiError('로그인 실패:', error);
      setLoginError('전화번호 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    phone,
    setPhone: (value: string) => setPhone(normalizePhoneDigits(value)),
    password,
    setPassword,
    isFilled,
    isSubmitting,
    loginError,
    handleLogin,
  };
}
