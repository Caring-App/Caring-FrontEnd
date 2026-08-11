import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useSignUp from '@features/auth/model/useSignUp';
import { BirthDatePicker, CaringLogo } from '@features/auth/ui';

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="mb-4">
      <Text className="mb-2 font-pretendard-semibold text-lg text-text-body">{label}</Text>
      {children}
    </View>
  );
}

export const SignupScreen = () => {
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
  } = useSignUp();

  const inputClassName = 'rounded-md border border-border-input bg-surface px-3.5 py-2 font-pretendard-light text-lg text-text-body';

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {/* 상단 헤더 */}
        <View className="flex-row items-center gap-3 py-4">
          <CaringLogo width={44} height={44} />
          <Text className="font-pretendard-bold text-2xl text-text-primary">회원 가입</Text>
        </View>

        <View className="mt-4">
          <FormField label="이름">
            <TextInput
              className={inputClassName}
              placeholder="이름을 입력해 주세요"
              placeholderTextColor="#6C757D"
              value={form.name}
              onChangeText={setName}
            />
          </FormField>

          <FormField label="전화번호">
            <View className="flex-row items-center gap-2">
              <TextInput
                className={`${inputClassName} flex-1`}
                placeholder="전화번호를 입력해 주세요"
                placeholderTextColor="#6C757D"
                keyboardType="number-pad"
                value={form.phone}
                onChangeText={setPhone}
              />
              <TouchableOpacity
                className="rounded-card bg-primary px-4 py-2"
                onPress={handleSendAuthCode}
                activeOpacity={0.8}
              >
                <Text className="font-pretendard-semibold text-xs text-white">인증</Text>
              </TouchableOpacity>
            </View>
          </FormField>

          <FormField label="인증번호 입력">
            <TextInput
              className={inputClassName}
              placeholder="인증번호 6자리를 입력해 주세요"
              placeholderTextColor="#6C757D"
              keyboardType="number-pad"
              value={form.authCode}
              onChangeText={setAuthCode}
            />
          </FormField>

          <FormField label="비밀번호">
            <TextInput
              className={inputClassName}
              placeholder="비밀번호를 입력해 주세요"
              placeholderTextColor="#6C757D"
              secureTextEntry
              value={form.password}
              onChangeText={setPassword}
            />
          </FormField>

          <FormField label="비밀번호 확인">
            <TextInput
              className={inputClassName}
              placeholder="비밀번호를 다시 입력해 주세요"
              placeholderTextColor="#6C757D"
              secureTextEntry
              value={form.passwordConfirm}
              onChangeText={setPasswordConfirm}
            />
            {!!form.password && !!form.passwordConfirm && form.password !== form.passwordConfirm && (
              <Text className="mt-1 text-xs text-text-danger">비밀번호가 일치하지 않습니다.</Text>
            )}
          </FormField>

          <FormField label="생년월일">
            <BirthDatePicker value={form.birthDate} onChange={setBirthDate} />
          </FormField>

          <FormField label="주소">
            <TextInput
              className={inputClassName}
              placeholder="주소를 입력해 주세요"
              placeholderTextColor="#6C757D"
              value={form.address}
              onChangeText={setAddress}
            />
          </FormField>
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
