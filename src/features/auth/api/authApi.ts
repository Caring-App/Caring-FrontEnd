import { login as kakaoLogin, getProfile as getKakaoProfile } from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';
import Config from 'react-native-config';
import { axiosInstance } from '@shared/api/axiosInstance';
import { setTokens } from '@shared/api/tokenStorage';
import { useSessionStore } from '@shared/store/useSessionStore';
import { UserRole } from '@shared/types';
import { SocialLoginCheckResponse, SocialProvider, SocialSignupProfile } from '../model/types';

// ---------------------------------------------------------
// 1. 네이버 초기 세팅 (카카오는 별도 초기화 불필요, 구글은 지원 중단)
// ---------------------------------------------------------

const naverInitParams = {
  consumerKey: Config.NAVER_CLIENT_ID as string,
  consumerSecret: Config.NAVER_CLIENT_SECRET as string,
  appName: 'Caring',
  serviceUrlScheme: 'caring',
};
NaverLogin.initialize(naverInitParams);

// provider별 SDK 동의(로그인) + 프로필 조회를 한 인터페이스로 묶어서 위쪽 로직이 provider 분기 없이 쓸 수 있게 함
const SOCIAL_SDK: Record<
  SocialProvider,
  {
    login: () => Promise<string>;
    getProfile: (accessToken: string) => Promise<{ providerId: string; name: string; phone: string }>;
  }
> = {
  kakao: {
    login: async () => {
      const result = await kakaoLogin();
      return result.accessToken;
    },
    getProfile: async () => {
      const profile = await getKakaoProfile();
      return { providerId: String(profile.id), name: profile.name, phone: profile.phoneNumber };
    },
  },
  naver: {
    login: async () => {
      const { isSuccess, successResponse } = await NaverLogin.login();
      if (!isSuccess || !successResponse) {
        throw new Error('네이버 로그인이 취소되었습니다.');
      }
      return successResponse.accessToken;
    },
    getProfile: async accessToken => {
      const { response } = await NaverLogin.getProfile(accessToken);
      return { providerId: response.id, name: response.name, phone: response.mobile ?? '' };
    },
  },
};

// [1단계] 간편 로그인 버튼 탭 → 소셜 SDK 자체 동의 화면부터 바로 띄움 (역할은 아직 몰라도 됨)
export const getSocialAccessToken = (provider: SocialProvider): Promise<string> => SOCIAL_SDK[provider].login();

export type SocialAuthResult = { status: 'LOGGED_IN' } | ({ status: 'NEW_MEMBER' } & SocialSignupProfile);

// [2단계] 역할 선택 후 호출 — 기존 회원이면 바로 로그인 처리, 신규 회원이면 회원가입에 필요한 프로필을 반환
export const checkSocialMember = async (
  provider: SocialProvider,
  accessToken: string,
  role: UserRole,
): Promise<SocialAuthResult> => {
  const { data } = await axiosInstance.post<SocialLoginCheckResponse>(`/api/auth/${provider}`, {
    accessToken,
    role,
  });

  if (!data.newMember) {
    await setTokens(data.accessToken!, data.refreshToken!);
    useSessionStore.getState().login(data.role ?? role, {
      memberId: data.memberId!,
      name: data.name!,
      nickname: data.nickname!,
    });
    return { status: 'LOGGED_IN' };
  }

  const profile = await SOCIAL_SDK[provider].getProfile(accessToken);
  return { status: 'NEW_MEMBER', provider, accessToken, ...profile };
};
