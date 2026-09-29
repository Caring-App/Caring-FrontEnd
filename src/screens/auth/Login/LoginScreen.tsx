import React, { useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { getSocialAccessToken } from '@features/auth/api';
import { SocialProvider } from '@features/auth/model';
import { StartScreenButton } from '@features/auth/ui';
import { logApiError } from '@shared/api';
import { CaringLogoOnBrand } from '@shared/ui/AppHeader/CaringLogo';
import { colors } from '@shared/theme/colors';
import KakaoIcon from '@assets/icons/auth/kakao.svg';
import NaverIcon from '@assets/icons/auth/naver.svg';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

// 시작 화면 (Figma 964:5309) — 간편 로그인 / 전화번호 로그인 / 회원가입 진입점
export default function LoginScreen({ navigation }: Props) {
  const [isSocialSubmitting, setIsSocialSubmitting] = useState(false);
  const [socialError, setSocialError] = useState('');

  // 간편 로그인 버튼 → 카카오/네이버 자체 동의 화면부터 바로 진행. 역할은 아직 몰라도 되므로
  // accessToken만 받아서 역할 선택 화면(SignupTypeSelect)으로 넘기고, 신규/기존 회원 판별은 거기서 함
  const handleSocialButtonPress = async (provider: SocialProvider) => {
    if (isSocialSubmitting) return;
    setSocialError('');
    setIsSocialSubmitting(true);
    try {
      const accessToken = await getSocialAccessToken(provider);
      navigation.navigate('SignupTypeSelect', { social: { provider, accessToken } });
    } catch (error) {
      logApiError(`${provider} 간편 로그인 실패:`, error);
      setSocialError('간편 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSocialSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center">
        <CaringLogoOnBrand />
      </View>

      <View className="gap-3 px-10 pb-14">
        <StartScreenButton
          label="카카오로 로그인"
          icon={<KakaoIcon width={22} height={22} />}
          onPress={() => handleSocialButtonPress('kakao')}
          disabled={isSocialSubmitting}
        />
        <StartScreenButton
          label="네이버로 로그인"
          icon={<NaverIcon width={20} height={20} />}
          onPress={() => handleSocialButtonPress('naver')}
          disabled={isSocialSubmitting}
        />
        <StartScreenButton label="전화번호로 로그인" onPress={() => navigation.navigate('PhoneLogin')} />
        <StartScreenButton label="회원가입" onPress={() => navigation.navigate('SignupTypeSelect')} />

        {isSocialSubmitting && <ActivityIndicator size="small" color={colors.surface} />}
        {!!socialError && <Text className="text-center text-xs text-white">{socialError}</Text>}
      </View>
    </SafeAreaView>
  );
}
