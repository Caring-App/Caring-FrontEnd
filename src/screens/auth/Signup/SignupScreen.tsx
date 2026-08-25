import React from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useSignUp from '@features/auth/model/useSignUp';
import { SignupCommonFields } from '@features/auth/ui';
import { CaringLogo } from '@shared/ui/AppHeader/CaringLogo';
import { colors } from '@shared/theme/colors';

export const SignupScreen = ({ navigation }: { navigation: any }) => {
  const {
    form,
    setName,
    setPhone,
    setAuthCode,
    setPassword,
    setPasswordConfirm,
    setAddress,
    handleSendAuthCode,
    handleVerifyAuthCode,
    isSendingCode,
    isCodeSent,
    isVerifyingCode,
    isPhoneVerified,
    authError,
    handleSubmit,
    isFormValid,
    isSubmitting,
    submitError,
  } = useSignUp(navigation);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {/* 상단 헤더 */}
        <View className="relative flex-row items-center justify-center py-4">
          <View className="absolute left-0">
            <CaringLogo size={44} />
          </View>
          <Text className="font-pretendard-bold text-2xl text-text-primary">회원 가입</Text>
        </View>

        <View className="mt-4">
          <SignupCommonFields
            form={form}
            setName={setName}
            setPhone={setPhone}
            setAuthCode={setAuthCode}
            setPassword={setPassword}
            setPasswordConfirm={setPasswordConfirm}
            setAddress={setAddress}
            handleSendAuthCode={handleSendAuthCode}
            handleVerifyAuthCode={handleVerifyAuthCode}
            isSendingCode={isSendingCode}
            isCodeSent={isCodeSent}
            isVerifyingCode={isVerifyingCode}
            isPhoneVerified={isPhoneVerified}
            authError={authError}
          />
        </View>

        {!!submitError && (
          <Text className="mt-2 text-center text-xs text-text-danger">{submitError}</Text>
        )}

        <TouchableOpacity
          className={`mt-6 h-[52px] items-center justify-center rounded-card ${
            isFormValid && !isSubmitting ? 'bg-primary' : 'bg-border-link'
          }`}
          onPress={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Text className="font-pretendard-semibold text-lg text-white">회원가입</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;
