import { useState } from 'react';
import { checkSocialMember } from '@features/auth/api';
import { UserRole } from '@shared/types';
import { SocialAccessToken } from './types';

export function useSignupTypeSelect(navigation: any, social?: SocialAccessToken) {
  const [isCheckingSocial, setIsCheckingSocial] = useState(false);
  const [socialError, setSocialError] = useState('');

  const handleRoleSelect = async (role: UserRole) => {
    // 로컬 회원가입 진입 — 바로 약관 동의 화면으로 이동 (기존 동작 그대로)
    if (!social) {
      navigation.navigate('TermsAgreement', { role });
      return;
    }

    // 소셜 진입 — 이제서야 역할이 정해졌으니 신규/기존 회원인지 백엔드에 확인
    if (isCheckingSocial) return;
    setSocialError('');
    setIsCheckingSocial(true);
    try {
      const result = await checkSocialMember(social.provider, social.accessToken, role);
      if (result.status === 'NEW_MEMBER') {
        const { provider, accessToken, providerId, name, phone } = result;
        navigation.navigate('TermsAgreement', { role, social: { provider, accessToken, providerId, name, phone } });
      }
      // 기존 회원이면 checkSocialMember 내부에서 이미 로그인 처리됨 — RootNavigator가 알아서 전환
    } catch (error) {
      console.error('소셜 회원 확인 실패:', error);
      setSocialError('간편 로그인 확인에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsCheckingSocial(false);
    }
  };

  return {
    handleRoleSelect,
    isCheckingSocial,
    socialError,
  };
}
