import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '@app/navigation/types';
import { useSignupDraftStore } from './useSignupDraftStore';

// 회원가입 단계 화면의 X(가입 중단) — 입력하던 값(비밀번호 포함)을 비우고 시작 화면으로 돌아감
export function useSignupExit() {
  const navigation = useNavigation<AuthStackNavigationProp>();

  return useCallback(() => {
    useSignupDraftStore.getState().reset();
    navigation.popToTop();
  }, [navigation]);
}
