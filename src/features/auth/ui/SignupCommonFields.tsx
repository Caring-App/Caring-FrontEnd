import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import BirthDatePicker from './BirthDatePicker';
import { FormField, FORM_INPUT_CLASSNAME, FORM_INPUT_PLACEHOLDER_COLOR } from './FormField';

// 보호자/돌봄대상자 회원가입 폼이 공유하는 필드(이름/전화번호/인증번호/비밀번호/생년월일/주소)
interface SignupCommonFieldsProps {
  form: {
    name: string;
    phone: string;
    authCode: string;
    password: string;
    passwordConfirm: string;
    birthDate: string;
    address: string;
  };
  setName: (value: string) => void;
  setPhone: (value: string) => void;
  setAuthCode: (value: string) => void;
  setPassword: (value: string) => void;
  setPasswordConfirm: (value: string) => void;
  setBirthDate: (value: string) => void;
  setAddress: (value: string) => void;
  handleSendAuthCode: () => void;
}

export function SignupCommonFields({
  form,
  setName,
  setPhone,
  setAuthCode,
  setPassword,
  setPasswordConfirm,
  setBirthDate,
  setAddress,
  handleSendAuthCode,
}: SignupCommonFieldsProps) {
  return (
    <>
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
    </>
  );
}
