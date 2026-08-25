import { useState } from 'react';
import { registerSocialApi } from '@features/auth/api';
import { logApiError, setTokens } from '@shared/api';
import { useSessionStore } from '@shared/store/useSessionStore';
import { UserRole } from '@shared/types';
import { SocialProviderCode, SocialSignupProfile } from './types';

interface Params extends SocialSignupProfile {
  role: UserRole;
}

// 소셜 신규 회원가입 마지막 단계 — 보호자는 주소만, 돌봄대상자는 주소+기저질환을 추가로 입력받음
// (이름/전화번호는 카카오/네이버 프로필에서, 생년월일은 백엔드 협의로 더 이상 받지 않음)
export default function useSocialAdditionalInfo(navigation: any, params: Params) {
  const { provider, providerId, role, name, phone } = params;
  const [address, setAddress] = useState('');
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const toggleDisease = (disease: string) => {
    setSelectedDiseases(prev => (prev.includes(disease) ? prev.filter(item => item !== disease) : [...prev, disease]));
  };

  const isFormValid = !!address && (role !== 'WARD' || selectedDiseases.length > 0);

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const response = await registerSocialApi({
        provider: provider.toUpperCase() as SocialProviderCode,
        providerId,
        role,
        name,
        phone,
        address,
        ...(role === 'WARD' ? { diseases: selectedDiseases } : {}),
      });

      await setTokens(response.accessToken, response.refreshToken);
      // register/social 응답엔 nickname이 따로 없어서 name으로 대체
      useSessionStore.getState().setPendingProfile(role, {
        memberId: response.memberId,
        name: response.name,
        nickname: response.name,
      });

      if (role === 'WARD') {
        navigation.navigate('WardSignupWelcome', { userName: response.name });
      } else {
        navigation.navigate('SignupWelcome', { userName: response.name, protectorCode: response.protectorCode });
      }
    } catch (error) {
      logApiError('소셜 회원가입 실패:', error);
      setSubmitError('회원가입에 실패했습니다. 입력하신 정보를 다시 확인해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    role,
    address,
    setAddress,
    selectedDiseases,
    toggleDisease,
    isFormValid,
    isSubmitting,
    submitError,
    handleSubmit,
  };
}
