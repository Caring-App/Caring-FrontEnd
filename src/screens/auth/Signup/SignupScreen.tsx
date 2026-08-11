import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useSignUp from '@features/auth/model/useSignUp';
import { SignupCommonFields } from '@features/auth/ui';
import { CaringLogo } from '@shared/ui/AppHeader/CaringLogo';

export const SignupScreen = ({ navigation }: { navigation: any }) => {
  const {
    form,
    setName,
    setPhone,
    setAuthCode,
    setPassword,
    setPasswordConfirm,
    setBirthDate,
    setAddress,
    handleSendAuthCode,
    handleSubmit,
    isFormValid,
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
            setBirthDate={setBirthDate}
            setAddress={setAddress}
            handleSendAuthCode={handleSendAuthCode}
          />
        </View>

        <TouchableOpacity
          className={`mt-6 h-[52px] items-center justify-center rounded-card ${isFormValid ? 'bg-primary' : 'bg-border-link'}`}
          onPress={handleSubmit}
          disabled={!isFormValid}
          activeOpacity={0.8}
        >
          <Text className="font-pretendard-semibold text-lg text-white">회원가입</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;
