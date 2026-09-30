import React, { useEffect } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { useSessionStore } from '@shared/store/useSessionStore';
import { restoreSession } from '@features/auth/utils';
import { CaringLogoOnBrand } from '@shared/ui/AppHeader/CaringLogo';

const SPLASH_DURATION_MS = 1500;

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// 앱 실행 직후 보여주는 오렌지 로고 화면 (Figma 964:5555 "랜딩")
// 네이티브 스플래시가 아니라 JS 화면이라 RN 번들 로딩이 끝난 뒤에 뜸.
// 로고를 보여주는 동안 이전 로그인 상태를 복원해서, 복원되면 로그인 화면 없이 바로 역할별 홈으로 들어감
export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [session] = await Promise.all([
        restoreSession().catch(error => {
          console.log('세션 복원 실패:', error);
          return null;
        }),
        sleep(SPLASH_DURATION_MS),
      ]);
      if (cancelled) return;
      useSessionStore.getState().markSplashShown();
      if (session) {
        useSessionStore.getState().login(session.role, session.profile);
      } else {
        navigation.replace('Login');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-primary">
      <CaringLogoOnBrand />
    </View>
  );
}
