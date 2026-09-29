import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { loginApi } from '@features/auth/api';
import { FORMATTED_PHONE_MAX_LENGTH, formatPhoneNumber, normalizePhoneDigits } from '@features/auth/utils';
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
  // 입력칸에는 010-0000-0000 형태로 보여주고, 상태·전송은 숫자만(회원가입 때 숫자만 저장하므로 로그인도 맞춤)
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
              placeholder="전화번호를 입력하세요"
              placeholderTextColor={colors.textSignupDesc}
              keyboardType="number-pad"
              value={formatPhoneNumber(phone)}
              onChangeText={value => setPhone(normalizePhoneDigits(value))}
              maxLength={FORMATTED_PHONE_MAX_LENGTH}
            />
          </View>
          <View className="gap-2">
            <Text className="font-pretendard-light text-base text-text-loginLabel">비밀번호</Text>
            <TextInput
              className={LOGIN_INPUT_CLASSNAME}
              placeholder="비밀번호를 입력하세요"
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

        <View className="mt-4 flex-row justify-end">
          <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')} hitSlop={6}>
            <Text className="font-pretendard text-sm text-text-loginLink">비밀번호 재설정</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
