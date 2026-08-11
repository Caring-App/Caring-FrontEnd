import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useWardSignUp } from '@features/auth/model';
import { BirthDatePicker, FormField, FORM_INPUT_CLASSNAME, FORM_INPUT_PLACEHOLDER_COLOR } from '@features/auth/ui';
import { CaringLogo } from '@shared/ui/AppHeader/CaringLogo';

// 기저 질환 목록 (Figma 504:13234) — 중복 선택 가능
const DISEASE_LIST = [
  '고혈압',
  '당뇨병',
  '치매',
  '골다공증',
  '고지혈증',
  '관절염',
  '심혈관 질환',
  '만성 신부전',
  '파킨슨병',
  '기타',
];

export const WardSignupScreen = ({ navigation }: { navigation: any }) => {
  const {
    form,
    setName,
    setPhone,
    setAuthCode,
    setPassword,
    setPasswordConfirm,
    setBirthDate,
    setAddress,
    toggleDisease,
    handleSendAuthCode,
    handleSubmit,
    isFormValid,
  } = useWardSignUp(navigation);

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
          <FormField label="이름">
            <TextInput
              className={FORM_INPUT_CLASSNAME}
              placeholder="이름을 입력해 주세요"
              placeholderTextColor={FORM_INPUT_PLACEHOLDER_COLOR}
              value={form.name}
              onChangeText={setName}
            />
          </FormField>

          <View className="mb-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="font-pretendard-semibold text-lg text-text-body">전화번호</Text>
              <TouchableOpacity
                className="rounded-md bg-primary px-3 py-1"
                onPress={handleSendAuthCode}
                activeOpacity={0.8}
              >
                <Text className="font-pretendard-semibold text-[11px] text-white">인증</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              className={FORM_INPUT_CLASSNAME}
              placeholder="전화번호를 입력해 주세요"
              placeholderTextColor={FORM_INPUT_PLACEHOLDER_COLOR}
              keyboardType="number-pad"
              value={form.phone}
              onChangeText={setPhone}
            />
          </View>

          <FormField label="인증번호 입력">
            <TextInput
              className={FORM_INPUT_CLASSNAME}
              placeholder="인증번호를 입력해 주세요"
              placeholderTextColor={FORM_INPUT_PLACEHOLDER_COLOR}
              keyboardType="number-pad"
              value={form.authCode}
              onChangeText={setAuthCode}
            />
          </FormField>

          <FormField label="비밀번호">
            <TextInput
              className={FORM_INPUT_CLASSNAME}
              placeholder="비밀번호를 입력해 주세요"
              placeholderTextColor={FORM_INPUT_PLACEHOLDER_COLOR}
              secureTextEntry
              value={form.password}
              onChangeText={setPassword}
            />
          </FormField>

          <FormField label="비밀번호 확인">
            <TextInput
              className={FORM_INPUT_CLASSNAME}
              placeholder="비밀번호를 다시 입력해 주세요"
              placeholderTextColor={FORM_INPUT_PLACEHOLDER_COLOR}
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
              className={FORM_INPUT_CLASSNAME}
              placeholder="주소를 입력해 주세요"
              placeholderTextColor={FORM_INPUT_PLACEHOLDER_COLOR}
              value={form.address}
              onChangeText={setAddress}
            />
          </FormField>

          {/* 기저 질환 선택 (중복 선택 가능) */}
          <View className="mb-4">
            <Text className="mb-3 font-pretendard-semibold text-lg text-text-body">기저 질환 선택</Text>
            <View className="flex-row flex-wrap gap-y-3.5">
              {DISEASE_LIST.map((disease) => {
                const selected = form.selectedDiseases.includes(disease);
                return (
                  <TouchableOpacity
                    key={disease}
                    className="w-1/3 flex-row items-center gap-1.5 pr-2"
                    onPress={() => toggleDisease(disease)}
                    activeOpacity={0.7}
                  >
                    <View
                      className={`h-[13px] w-[13px] rounded-sm border ${
                        selected ? 'border-primary bg-primary' : 'border-border-input bg-surface'
                      }`}
                    />
                    <Text className="font-pretendard-semibold text-sm text-text-body">{disease}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
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

export default WardSignupScreen;
