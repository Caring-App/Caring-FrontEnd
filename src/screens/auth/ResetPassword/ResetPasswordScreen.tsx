import React from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useResetPassword from '@features/auth/model/useResetPassword';
import { CaringLogo } from '@shared/ui/AppHeader/CaringLogo';
import { FormField } from '@shared/ui';
import { colors } from '@shared/theme/colors';

const FORM_INPUT_CLASSNAME =
  'rounded-md border border-border-input bg-surface px-3.5 py-2 font-pretendard-light text-lg text-text-body';
const FORM_INPUT_PLACEHOLDER_COLOR = colors.textPlaceholder;

export default function ResetPasswordScreen({ navigation }: { navigation: any }) {
  const {
    phone,
    setPhone,
    authCode,
    setAuthCode,
    handleSendAuthCode,
    handleVerifyAuthCode,
    isSendingCode,
    isCodeSent,
    isVerifyingCode,
    isPhoneVerified,
    authError,
    newPassword,
    setNewPassword,
    newPasswordConfirm,
    setNewPasswordConfirm,
    isFormValid,
    isSubmitting,
    submitError,
    handleSubmit,
  } = useResetPassword(navigation);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        {/* 상단 헤더 */}
        <View className="relative flex-row items-center justify-center py-4">
          <View className="absolute left-0">
            <CaringLogo size={44} />
          </View>
          <Text className="font-pretendard-bold text-2xl text-text-primary">비밀번호 찾기</Text>
        </View>

        <Text className="mt-2 text-center font-pretendard-medium text-sm text-text-muted">
          가입하신 전화번호를 인증하고{'\n'}새 비밀번호를 설정해 주세요
        </Text>

        <View className="mt-6">
          <View className="mb-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="font-pretendard-semibold text-lg text-text-body">전화번호</Text>
              <TouchableOpacity
                className="min-w-[52px] items-center rounded-md bg-primary px-3 py-1"
                onPress={handleSendAuthCode}
                disabled={isSendingCode || !phone}
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
              value={phone}
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
                disabled={isVerifyingCode || isPhoneVerified || !authCode}
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
              value={authCode}
              onChangeText={setAuthCode}
              editable={!isPhoneVerified}
            />
            {isPhoneVerified ? (
              <Text className="mt-1 text-xs text-primary">휴대폰 인증이 완료되었습니다.</Text>
            ) : (
              !!authError && <Text className="mt-1 text-xs text-text-danger">{authError}</Text>
            )}
          </View>

          <FormField label="새 비밀번호">
            <TextInput
              className={FORM_INPUT_CLASSNAME}
              placeholder="새 비밀번호를 입력해 주세요"
              placeholderTextColor={FORM_INPUT_PLACEHOLDER_COLOR}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              editable={isPhoneVerified}
            />
          </FormField>

          <FormField label="새 비밀번호 확인">
            <TextInput
              className={FORM_INPUT_CLASSNAME}
              placeholder="새 비밀번호를 다시 입력해 주세요"
              placeholderTextColor={FORM_INPUT_PLACEHOLDER_COLOR}
              secureTextEntry
              value={newPasswordConfirm}
              onChangeText={setNewPasswordConfirm}
              editable={isPhoneVerified}
            />
            {!!newPassword && !!newPasswordConfirm && newPassword !== newPasswordConfirm && (
              <Text className="mt-1 text-xs text-text-danger">비밀번호가 일치하지 않습니다.</Text>
            )}
          </FormField>
        </View>

        {!!submitError && <Text className="mt-2 text-center text-xs text-text-danger">{submitError}</Text>}
      </ScrollView>

      {/* 비밀번호 변경 버튼 (하단 고정) */}
      <View className="bg-surface px-6 pb-10 pt-2">
        <TouchableOpacity
          className={`h-[52px] items-center justify-center rounded-card ${
            isFormValid && !isSubmitting ? 'bg-primary' : 'bg-border-link'
          }`}
          onPress={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Text className="font-pretendard-semibold text-lg text-white">비밀번호 변경</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
