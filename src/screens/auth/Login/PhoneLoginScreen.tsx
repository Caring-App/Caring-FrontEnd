import React from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { usePhoneLogin } from '@features/auth/model';
import { FORMATTED_PHONE_MAX_LENGTH, formatPhoneNumber } from '@features/auth/utils';
import { CaringLogoHorizontal } from '@shared/ui/AppHeader/CaringLogo';
import { colors } from '@shared/theme/colors';

// 전화번호 로그인 입력창 (Figma 965:42 — 흰 배경 / #E8E9EB 테두리 / radius 8)
const LOGIN_INPUT_CLASSNAME =
  'h-[52px] rounded-lg border border-border-loginField bg-surface px-4 font-pretendard-medium text-md text-text-primary';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneLogin'>;

// 전화번호 + 비밀번호 로그인 (Figma 964:5521)
export default function PhoneLoginScreen({ navigation }: Props) {
  const { phone, setPhone, password, setPassword, isFilled, isSubmitting, loginError, handleLogin } = usePhoneLogin();

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
              placeholderTextColor={colors.textAuthDesc}
              keyboardType="number-pad"
              value={formatPhoneNumber(phone)}
              onChangeText={setPhone}
              maxLength={FORMATTED_PHONE_MAX_LENGTH}
            />
          </View>
          <View className="gap-2">
            <Text className="font-pretendard-light text-base text-text-loginLabel">비밀번호</Text>
            <TextInput
              className={LOGIN_INPUT_CLASSNAME}
              placeholder="비밀번호를 입력하세요"
              placeholderTextColor={colors.textAuthDesc}
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
            isFilled ? 'bg-primary' : 'bg-loginButtonDisabled'
          }`}
          onPress={handleLogin}
          disabled={!isFilled || isSubmitting}
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
