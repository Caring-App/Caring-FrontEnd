import React, { useState } from 'react';
import { ActivityIndicator, View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginApi, getSocialAccessToken } from '@features/auth/api';
import { SocialProvider } from '@features/auth/model';
import { logApiError, setTokens } from '@shared/api';
import { useSessionStore } from '@shared/store/useSessionStore';
import { colors } from '@shared/theme/colors';
import KakaoLoginButton from '@assets/images/kakao-login.png';
import NaverLoginButton from '@assets/images/naver-login.png';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSocialSubmitting, setIsSocialSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password || isSubmitting) return;
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

  // 간편 로그인 버튼 → 카카오/네이버 자체 동의 화면부터 바로 진행. 역할은 아직 몰라도 되므로
  // accessToken만 받아서 역할 선택 화면(SignupTypeSelect)으로 넘기고, 신규/기존 회원 판별은 거기서 함
  const handleSocialButtonPress = async (provider: SocialProvider) => {
    if (isSocialSubmitting) return;
    setLoginError('');
    setIsSocialSubmitting(true);
    try {
      const accessToken = await getSocialAccessToken(provider);
      navigation.navigate('SignupTypeSelect', { social: { provider, accessToken } });
    } catch (error) {
      logApiError(`${provider} 간편 로그인 실패:`, error);
      setLoginError('간편 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSocialSubmitting(false);
    }
  };

  // [DEV] 보호자 진입 핸들러
  const handleDevProtector = () => {
    useSessionStore.getState().login('PROTECTOR');
  };

  // [DEV] 어르신 진입 핸들러
  const handleDevSenior = () => {
    useSessionStore.getState().login('WARD');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-10">
          {__DEV__ && (
            <View className="mt-4 gap-2">
              <TouchableOpacity
                className="items-center rounded-card border border-primary py-2.5"
                activeOpacity={0.8}
                onPress={handleDevProtector}
              >
                <Text className="font-pretendard-semibold text-sm text-primary">[DEV] 보호자로 바로 진입</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center rounded-card border border-primary py-2.5"
                activeOpacity={0.8}
                onPress={handleDevSenior}
              >
                <Text className="font-pretendard-semibold text-sm text-primary">[DEV] 어르신으로 바로 진입</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 타이틀 영역 */}
          <View className="mt-14 items-center">
            <Text className="font-pretendard-bold text-[40px] text-text-loginSubtitle">돌봄의 시작, 케어링</Text>
            <Text className="font-pretendard-bold text-[80px] text-primary">Caring</Text>
          </View>

          {/* 로그인 입력 폼 */}
          <View className="mt-14 gap-3">
            <TextInput
              className="h-[43px] rounded-card border border-border-loginInput px-6 text-center font-pretendard-semibold text-base text-text-primary"
              placeholder="휴대폰 번호를 입력하세요"
              placeholderTextColor={colors.textLoginPlaceholder}
              keyboardType="number-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <TextInput
              className="h-[43px] rounded-card border border-border-loginInput px-6 text-center font-pretendard-semibold text-base text-text-primary"
              placeholder="비밀번호를 입력하세요"
              placeholderTextColor={colors.textLoginPlaceholder}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {!!loginError && (
            <Text className="mt-2 text-center text-xs text-text-danger">{loginError}</Text>
          )}

          <TouchableOpacity
            className="mt-4 h-[52px] items-center justify-center rounded-card bg-primary"
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <Text className="font-pretendard-semibold text-lg text-white">로그인</Text>
            )}
          </TouchableOpacity>

          {/* 하단 링크 영역 */}
          <View className="mt-4 flex-row items-center justify-center gap-3">
            <TouchableOpacity onPress={() => navigation.navigate('SignupTypeSelect')}>
              <Text className="font-pretendard-semibold text-xs text-text-muted">회원가입</Text>
            </TouchableOpacity>
            <Text className="text-xs text-border-link">|</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
              <Text className="font-pretendard-semibold text-xs text-text-muted">비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>

          {/* 간편 로그인 구분선 */}
          <View className="mt-8 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-border" />
            <Text className="font-pretendard-semibold text-sm text-text-muted">간편 로그인</Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          {/* 간편 로그인 원형 버튼 영역 (구글은 지원 중단) */}
          <View className="mb-8 mt-6 flex-row items-center justify-center gap-6">
            <TouchableOpacity
              disabled={isSocialSubmitting}
              activeOpacity={0.8}
              onPress={() => handleSocialButtonPress('kakao')}
            >
              <Image source={KakaoLoginButton} className="h-16 w-16 rounded-full" />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isSocialSubmitting}
              activeOpacity={0.8}
              onPress={() => handleSocialButtonPress('naver')}
            >
              <Image source={NaverLoginButton} className="h-16 w-16 rounded-full" />
            </TouchableOpacity>
          </View>

          {isSocialSubmitting && (
            <View className="mb-4 items-center">
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
