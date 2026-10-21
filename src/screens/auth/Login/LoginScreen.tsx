import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { useSocialLoginStart } from '@features/auth/model';
import { StartScreenButton } from '@features/auth/ui';
import { CaringLogoOnBrand } from '@shared/ui/AppHeader/CaringLogo';
import { colors } from '@shared/theme/colors';
import KakaoIcon from '@assets/icons/auth/kakao.svg';
import NaverIcon from '@assets/icons/auth/naver.svg';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

// 시작 화면 (Figma 964:5309) — 간편 로그인 / 전화번호 로그인 / 회원가입 진입점
export default function LoginScreen({ navigation }: Props) {
  const { handleSocialLogin, isSocialSubmitting, socialError } = useSocialLoginStart(social =>
    navigation.navigate('SignupTypeSelect', { social }),
  );

  return (
    <SafeAreaView className="flex-1 bg-primary" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center">
        <CaringLogoOnBrand />
      </View>

      <View className="gap-3 px-10 pb-14">
        <StartScreenButton
          label="카카오로 로그인"
          icon={<KakaoIcon width={22} height={22} />}
          onPress={() => handleSocialLogin('kakao')}
          disabled={isSocialSubmitting}
        />
        <StartScreenButton
          label="네이버로 로그인"
          icon={<NaverIcon width={20} height={20} />}
          onPress={() => handleSocialLogin('naver')}
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
