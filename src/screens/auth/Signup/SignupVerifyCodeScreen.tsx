import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { useSignupDraftStore, useSignupVerificationCode } from '@features/auth/model';
import { AuthStepLayout, AuthTextField } from '@features/auth/ui';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignupVerifyCode'>;

// 인증번호 입력 (Figma 970:7194) — 3분 타이머 + 재요청
export default function SignupVerifyCodeScreen({ navigation }: Props) {
  const { code, setCode, remainingTime, isExpired, resend, isResending, verify, isVerifying, error } =
    useSignupVerificationCode(() => navigation.navigate('SignupPassword'));

  const handleClose = () => {
    useSignupDraftStore.getState().reset();
    navigation.popToTop();
  };

  return (
    <AuthStepLayout
      title="인증 번호를 입력해주세요."
      description={'원활한 서비스를 이용을 위해 한번 인증하는\n과정이 필요합니다.'}
      onClose={handleClose}
      buttonLabel="완료"
      onPressButton={verify}
      buttonDisabled={!code || isExpired}
      isLoading={isVerifying}
    >
      <View className="mt-6">
        <AuthTextField
          label="인증번호"
          placeholder="인증번호"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          value={code}
          onChangeText={setCode}
          autoFocus
          errorMessage={error}
          rightElement={
            <Text className="font-pretendard-medium text-base text-text-authDesc">{remainingTime}</Text>
          }
        />
      </View>

      <TouchableOpacity className="mt-5 items-center" onPress={resend} disabled={isResending} hitSlop={8}>
        <Text className="font-pretendard text-base text-text-termItem underline">인증번호 재요청</Text>
      </TouchableOpacity>
    </AuthStepLayout>
  );
}
