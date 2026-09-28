import React, { useEffect } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { CaringLogoOnBrand } from '@shared/ui/AppHeader/CaringLogo';

const SPLASH_DURATION_MS = 1500;

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

// 앱 실행 직후 보여주는 오렌지 로고 화면 (Figma 964:5555 "랜딩")
// 네이티브 스플래시가 아니라 JS 화면이라 RN 번들 로딩이 끝난 뒤에 뜸
export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Login'), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-primary">
      <CaringLogoOnBrand />
    </View>
  );
}
