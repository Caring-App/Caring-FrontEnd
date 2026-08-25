import React from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FormField } from '@shared/ui';
import { colors } from '@shared/theme/colors';

// 회원가입 폼 입력창 공용 스타일 (SignupScreen, WardSignupScreen)
const FORM_INPUT_CLASSNAME =
  'rounded-md border border-border-input bg-surface px-3.5 py-2 font-pretendard-light text-lg text-text-body';
const FORM_INPUT_PLACEHOLDER_COLOR = colors.textPlaceholder;

// 보호자/돌봄대상자 회원가입 폼이 공유하는 필드(이름/전화번호/인증번호/비밀번호/주소)
interface SignupCommonFieldsProps {
  form: {
    name: string;
    phone: string;
    authCode: string;
    password: string;
    passwordConfirm: string;
    address: string;
  };
  setName: (value: string) => void;
  setPhone: (value: string) => void;
  setAuthCode: (value: string) => void;
  setPassword: (value: string) => void;
  setPasswordConfirm: (value: string) => void;
  setAddress: (value: string) => void;
  handleSendAuthCode: () => void;
  handleVerifyAuthCode: () => void;
  isSendingCode: boolean;
  isCodeSent: boolean;
  isVerifyingCode: boolean;
  isPhoneVerified: boolean;
  authError: string;
}

export function SignupCommonFields({
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
            className="min-w-[52px] items-center rounded-md bg-primary px-3 py-1"
            onPress={handleSendAuthCode}
            disabled={isSendingCode || !form.phone}
            activeOpacity={0.8}
          >
            {isSendingCode ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <Text className="font-pretendard-semibold text-[11px] text-white">
                {isCodeSent ? '재전송' : '인증'}
              </Text>
            )}
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
        {isCodeSent && !isPhoneVerified && (
          <Text className="mt-1 text-xs text-text-muted">인증번호가 발송되었습니다.</Text>
        )}
      </View>

      <View className="mb-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="font-pretendard-semibold text-lg text-text-body">인증번호 입력</Text>
          <TouchableOpacity
            className="min-w-[52px] items-center rounded-md bg-primary px-3 py-1"
            onPress={handleVerifyAuthCode}
            disabled={isVerifyingCode || isPhoneVerified || !form.authCode}
            activeOpacity={0.8}
          >
            {isVerifyingCode ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <Text className="font-pretendard-semibold text-[11px] text-white">
                {isPhoneVerified ? '확인 완료' : '확인'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <TextInput
          className={FORM_INPUT_CLASSNAME}
          placeholder="인증번호를 입력해 주세요"
          placeholderTextColor={FORM_INPUT_PLACEHOLDER_COLOR}
          keyboardType="number-pad"
          value={form.authCode}
          onChangeText={setAuthCode}
          editable={!isPhoneVerified}
        />
        {isPhoneVerified ? (
          <Text className="mt-1 text-xs text-primary">휴대폰 인증이 완료되었습니다.</Text>
        ) : (
          !!authError && <Text className="mt-1 text-xs text-text-danger">{authError}</Text>
        )}
      </View>

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
