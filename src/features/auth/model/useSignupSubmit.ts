import { useState } from 'react';
import { AuthStackNavigationProp } from '@app/navigation/types';
import { registerProtectorApi, registerSocialApi, registerWardApi } from '@features/auth/api';
import { loginAfterRegister } from '@features/auth/utils';
import { logApiError, setTokens } from '@shared/api';
import { useSessionStore } from '@shared/store/useSessionStore';
import { SocialProviderCode } from './types';
import { useSignupDraftStore } from './useSignupDraftStore';

const REGISTER_FAILED_MESSAGE = '회원가입에 실패했습니다. 입력하신 정보를 다시 확인해 주세요.';

// 회원가입 마지막 단계(보호자: 주소, 돌봄대상자: 기저질환)에서 호출 — 단계별로 모아둔 입력값으로
// 로컬/소셜 가입 API를 골라 호출하고, 성공하면 역할별 환영 화면으로 이동함
export function useSignupSubmit(navigation: AuthStackNavigationProp) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const submitSocial = async () => {
    const { role, social, baseAddress, detailAddress, diseases } = useSignupDraftStore.getState();
    if (!role || !social) return;

    try {
      const response = await registerSocialApi({
        provider: social.provider.toUpperCase() as SocialProviderCode,
        providerId: social.providerId,
        role,
        name: social.name,
        phone: social.phone,
        baseAddress,
        detailAddress,
        ...(role === 'WARD' ? { diseases } : {}),
      });

      await setTokens(response.accessToken, response.refreshToken);
      // register/social 응답엔 nickname이 따로 없어서 name으로 대체
      useSessionStore.getState().setPendingProfile(role, {
        memberId: response.memberId,
        name: response.name,
        nickname: response.name,
      });
      useSignupDraftStore.getState().reset();

      if (role === 'WARD') {
        navigation.navigate('WardSignupWelcome', { userName: response.name });
      } else {
        navigation.navigate('SignupWelcome', { userName: response.name, protectorCode: response.protectorCode });
      }
    } catch (error) {
      logApiError('소셜 회원가입 실패:', error);
      setSubmitError(REGISTER_FAILED_MESSAGE);
    }
  };

  const submitLocal = async () => {
    const { role, name, phone, authCode, password, passwordConfirm, baseAddress, detailAddress, diseases } =
      useSignupDraftStore.getState();
    if (!role) return;

    const payload = {
      name,
      phone,
      authNumber: authCode,
      password,
      passwordCheck: passwordConfirm,
      baseAddress,
      detailAddress,
    };

    let protectorCode = '';
    try {
      if (role === 'WARD') {
        await registerWardApi({ ...payload, diseases });
      } else {
        ({ protectorCode } = await registerProtectorApi(payload));
      }
    } catch (error) {
      logApiError(`${role === 'WARD' ? '돌봄대상자' : '보호자'} 회원가입 실패:`, error);
      setSubmitError(REGISTER_FAILED_MESSAGE);
      return;
    }

    try {
      await loginAfterRegister(phone, password, role);
      useSignupDraftStore.getState().reset();
      if (role === 'WARD') {
        navigation.navigate('WardSignupWelcome', { userName: name });
      } else {
        navigation.navigate('SignupWelcome', { userName: name, protectorCode });
      }
    } catch (error) {
      logApiError('회원가입 후 자동 로그인 실패:', error);
      setSubmitError('가입은 완료됐지만 로그인에 실패했어요. 로그인 화면에서 다시 시도해 주세요.');
    }
  };

  const submit = async () => {
    if (isSubmitting) return;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      if (useSignupDraftStore.getState().social) {
        await submitSocial();
      } else {
        await submitLocal();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, submitError };
}
