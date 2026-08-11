import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSessionStore } from '@shared/store/useSessionStore';
import GoogleLogo from '@assets/icons/auth/google-logo.svg';
import KakaoLoginButton from '@assets/images/kakao-login.png';
import NaverLoginButton from '@assets/images/naver-login.png';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('로그인 시도:', id, password);
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
              className="h-[43px] rounded-card border border-border-loginInput px-6 font-pretendard-semibold text-base text-text-primary"
              placeholder="휴대폰 번호를 입력하세요."
              placeholderTextColor="#AEB5B5"
              value={id}
              onChangeText={setId}
            />
            <TextInput
              className="h-[43px] rounded-card border border-border-loginInput px-6 font-pretendard-semibold text-base text-text-primary"
              placeholder="비밀번호를 입력하세요."
              placeholderTextColor="#AEB5B5"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            className="mt-4 h-[52px] items-center justify-center rounded-card bg-primary"
            activeOpacity={0.8}
            onPress={handleLogin}
          >
            <Text className="font-pretendard-semibold text-lg text-white">로그인</Text>
          </TouchableOpacity>

          {/* 하단 링크 영역 */}
          <View className="mt-4 flex-row items-center justify-center gap-3">
            <TouchableOpacity>
              <Text className="font-pretendard-semibold text-xs text-text-muted">아이디 찾기</Text>
            </TouchableOpacity>
            <Text className="text-xs text-border-link">|</Text>
            <TouchableOpacity>
              <Text className="font-pretendard-semibold text-xs text-text-muted">비밀번호 찾기</Text>
            </TouchableOpacity>
            <Text className="text-xs text-border-link">|</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignupTypeSelect')}>
              <Text className="font-pretendard-semibold text-xs text-text-muted">회원가입</Text>
            </TouchableOpacity>
          </View>

          {/* 간편 로그인 구분선 */}
          <View className="mt-8 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-border" />
            <Text className="font-pretendard-semibold text-sm text-text-muted">간편 로그인</Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          {/* 간편 로그인 원형 버튼 영역 */}
          <View className="mb-8 mt-6 flex-row items-center justify-center gap-6">
            <TouchableOpacity>
              <Image source={KakaoLoginButton} className="h-16 w-16 rounded-full" />
            </TouchableOpacity>
            <TouchableOpacity className="h-16 w-16 items-center justify-center rounded-full border border-border-googleButton bg-surface">
              <GoogleLogo width={23} height={23} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={NaverLoginButton} className="h-16 w-16 rounded-full" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
