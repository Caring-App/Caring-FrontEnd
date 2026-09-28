import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { loginApi } from '@features/auth/api';
import { logApiError, setTokens } from '@shared/api';
import { useSessionStore } from '@shared/store/useSessionStore';
import { CaringLogoHorizontal } from '@shared/ui/AppHeader/CaringLogo';
import { colors } from '@shared/theme/colors';

// 전화번호 로그인 입력창 (Figma 965:42 — 흰 배경 / #E8E9EB 테두리 / radius 8)
const LOGIN_INPUT_CLASSNAME =
  'h-[52px] rounded-lg border border-border-loginField bg-surface px-4 font-pretendard-medium text-md text-text-primary';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneLogin'>;

// 전화번호 + 비밀번호 로그인 (Figma 964:5521)
export default function PhoneLoginScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const canSubmit = !!phone && !!password && !isSubmitting;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setLoginError('');
    setIsSubmitting(true);
    try {
      const result = await loginApi({ phone, password });
      await setTokens(result.accessToken, result.refreshToken);
      useSessionStore.getState().login(result.role, {
        memberId: result.memberId,
        name: result.name,
        nickname: result.nickname,
      });
    } catch (error) {
      logApiError('로그인 실패:', error);
      setLoginError('전화번호 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // TODO: 계정 찾기 API가 아직 없음 — 백엔드 준비되면 화면 연결
  const handleFindAccount = () => {
    Alert.alert('계정 찾기', '준비 중인 기능입니다.');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <View className="px-5 pt-3">
        <CaringLogoHorizontal />
      </View>

      <ScrollView
        contentContainerClassName="grow justify-center px-[43px] pb-[60px]"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="font-pretendard-bold text-[24px] leading-[36px] text-black">
          전화번호와 비밀번호를{'\n'}입력해주세요.
        </Text>

        <View className="mt-6 gap-6">
          <View className="gap-2">
            <Text className="font-pretendard-light text-base text-text-loginLabel">전화번호</Text>
            <TextInput
              className={LOGIN_INPUT_CLASSNAME}
              placeholder="01012345678"
              placeholderTextColor={colors.textSignupDesc}
              keyboardType="number-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <View className="gap-2">
            <Text className="font-pretendard-light text-base text-text-loginLabel">비밀번호</Text>
            <TextInput
              className={LOGIN_INPUT_CLASSNAME}
              placeholder="영문, 숫자, 특수문자 포함 8자 이상"
              placeholderTextColor={colors.textSignupDesc}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={handleLogin}
            />
          </View>
        </View>

        {!!loginError && <Text className="mt-3 text-xs text-text-danger">{loginError}</Text>}

        <TouchableOpacity
          className={`mt-10 h-[58px] items-center justify-center rounded-lg ${
            phone && password ? 'bg-primary' : 'bg-loginButtonDisabled'
          }`}
          onPress={handleLogin}
          disabled={!canSubmit}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Text className="font-pretendard-semibold text-lg text-white">로그인</Text>
          )}
        </TouchableOpacity>

        <View className="mt-4 flex-row items-center justify-end gap-3.5">
          <TouchableOpacity onPress={handleFindAccount} hitSlop={6}>
            <Text className="font-pretendard text-sm text-text-loginLink">계정 찾기</Text>
          </TouchableOpacity>
          <View className="h-[13px] w-px bg-black/5" />
          <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')} hitSlop={6}>
            <Text className="font-pretendard text-sm text-text-loginLink">비밀번호 재설정</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
