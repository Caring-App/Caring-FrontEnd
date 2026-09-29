import React from 'react';
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { formatPhoneNumber } from '@features/auth/model';
import useResetPassword from '@features/auth/model/useResetPassword';
import { SignupStepLayout, SignupTextField } from '@features/auth/ui';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

// 비밀번호 찾기 — 별도 시안이 없어 회원가입 단계 화면(SignupStepLayout, 회색 입력창)과 같은 스타일로 구성.
// 휴대폰 인증을 마쳐야 새 비밀번호 입력칸이 열림
export default function ResetPasswordScreen({ navigation }: Props) {
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
    isCodeExpired,
    remainingTime,
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

  const isPhoneComplete = /^01\d{8,9}$/.test(phone);
  const isConfirmMismatched = !!newPasswordConfirm && newPassword !== newPasswordConfirm;

  return (
    <SignupStepLayout
      title="비밀번호를 재설정해주세요"
      description={'가입하신 휴대폰번호로 인증한 뒤\n새 비밀번호를 설정해 주세요.'}
      onClose={() => navigation.goBack()}
      closeLabel="비밀번호 찾기 닫기"
      buttonLabel="비밀번호 변경"
      onPressButton={handleSubmit}
      buttonDisabled={!isFormValid}
      isLoading={isSubmitting}
      errorMessage={submitError}
    >
      <View className="mt-6 gap-6">
        <SignupTextField
          label="휴대폰번호"
          placeholder="휴대폰번호를 입력하세요"
          keyboardType="number-pad"
          value={formatPhoneNumber(phone)}
          onChangeText={setPhone}
          maxLength={13}
          autoFocus
          sideButton={{
            label: isCodeSent ? '재요청' : '인증 요청',
            onPress: handleSendAuthCode,
            disabled: !isPhoneComplete || isPhoneVerified,
            isLoading: isSendingCode,
          }}
        />

        {isCodeSent && (
          <SignupTextField
            label="인증번호"
            placeholder="인증번호"
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            value={authCode}
            onChangeText={setAuthCode}
            editable={!isPhoneVerified}
            errorMessage={isPhoneVerified ? undefined : authError}
            helperMessage={isPhoneVerified ? '휴대폰 인증이 완료되었습니다.' : undefined}
            rightElement={
              !isPhoneVerified && (
                <Text className="font-pretendard-medium text-base text-text-signupDesc">{remainingTime}</Text>
              )
            }
            sideButton={{
              label: isPhoneVerified ? '완료' : '확인',
              onPress: handleVerifyAuthCode,
              disabled: !authCode || isCodeExpired || isPhoneVerified,
              isLoading: isVerifyingCode,
            }}
          />
        )}

        {/* 발송 전 발송 실패 에러는 인증번호 칸이 없어서 여기서 보여줌 */}
        {!isCodeSent && !!authError && <Text className="-mt-4 text-xs text-text-danger">{authError}</Text>}

        {isPhoneVerified && (
          <>
            <SignupTextField
              label="새 비밀번호"
              placeholder="새 비밀번호를 입력하세요"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <SignupTextField
              label="새 비밀번호 확인"
              placeholder="새 비밀번호를 다시 한번 입력하세요"
              secureTextEntry
              value={newPasswordConfirm}
              onChangeText={setNewPasswordConfirm}
              onSubmitEditing={handleSubmit}
              errorMessage={isConfirmMismatched ? '비밀번호가 일치하지 않습니다.' : undefined}
            />
          </>
        )}
      </View>
    </SignupStepLayout>
  );
}
