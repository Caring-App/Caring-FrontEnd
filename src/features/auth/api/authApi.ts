import { login as kakaoLogin } from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import EncryptedStorage from 'react-native-encrypted-storage';
import Config from 'react-native-config';
import { axiosInstance } from '@shared/api/axiosInstance';
import { useSessionStore } from '@shared/store/useSessionStore';
import { UserRole } from '@shared/types';

// ---------------------------------------------------------
// 1. 구글 & 네이버 초기 세팅
// ---------------------------------------------------------

GoogleSignin.configure({
  webClientId: Config.GOOGLE_WEB_CLIENT_ID as string,
  offlineAccess: true,
});

const naverInitParams = {
  consumerKey: Config.NAVER_CLIENT_ID as string,
  consumerSecret: Config.NAVER_CLIENT_SECRET as string,
  appName: 'Caring',
  serviceUrlScheme: 'caring',
};
NaverLogin.initialize(naverInitParams);

// ---------------------------------------------------------
// 2. 공통 로그인 처리 함수
// ---------------------------------------------------------
const processLoginWithBackend = async (
  provider: 'kakao' | 'naver' | 'google',
  token: string,
  selectedRole: UserRole,
) => {
  try {
    const response = await axiosInstance.post(`/api/auth/${provider}`, {
      accessToken: token,
      role: selectedRole,
    });

    const { jwtAccessToken } = response.data;
    await EncryptedStorage.setItem('accessToken', jwtAccessToken);

    useSessionStore.getState().login(selectedRole);
  } catch (error) {
    console.error(`${provider} 백엔드 연동 실패:`, error);
  }
};

// ---------------------------------------------------------
// 3. 각각의 소셜 로그인 실행 함수들
// ---------------------------------------------------------

// [카카오 로그인]
export const handleKakaoLogin = async (selectedRole: UserRole) => {
  try {
    const result = await kakaoLogin();
    await processLoginWithBackend('kakao', result.accessToken, selectedRole);
  } catch (error) {
    console.error('카카오 로그인 에러:', error);
  }
};

// [네이버 로그인]
export const handleNaverLogin = async (selectedRole: UserRole) => {
  try {
    const { isSuccess, successResponse } = await NaverLogin.login();
    if (isSuccess && successResponse) {
      await processLoginWithBackend('naver', successResponse.accessToken, selectedRole);
    }
  } catch (error) {
    console.error('네이버 로그인 에러:', error);
  }
};

// [구글 로그인]
export const handleGoogleLogin = async (selectedRole: UserRole) => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
      if (response.data.idToken) {
        await processLoginWithBackend('google', response.data.idToken, selectedRole);
      }
    }
  } catch (error) {
    console.error('구글 로그인 에러:', error);
  }
};
