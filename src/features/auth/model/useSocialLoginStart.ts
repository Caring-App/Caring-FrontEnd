import { useState } from 'react';
import { getSocialAccessToken } from '@features/auth/api';
import { logApiError } from '@shared/api';
import { SocialAccessToken, SocialProvider } from './types';

// 시작 화면의 간편 로그인 버튼 → 카카오/네이버 자체 동의 화면부터 바로 진행. 역할은 아직 몰라도 되므로
// accessToken만 받아서 onSuccess로 넘기고(역할 선택 화면으로 이동), 신규/기존 회원 판별은 역할 선택 후에 함
export function useSocialLoginStart(onSuccess: (social: SocialAccessToken) => void) {
  const [isSocialSubmitting, setIsSocialSubmitting] = useState(false);
  const [socialError, setSocialError] = useState('');

  const handleSocialLogin = async (provider: SocialProvider) => {
    if (isSocialSubmitting) return;
    setSocialError('');
    setIsSocialSubmitting(true);
    try {
      const accessToken = await getSocialAccessToken(provider);
      onSuccess({ provider, accessToken });
    } catch (error) {
      logApiError(`${provider} 간편 로그인 실패:`, error);
      setSocialError('간편 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSocialSubmitting(false);
    }
  };

  return { handleSocialLogin, isSocialSubmitting, socialError };
}
