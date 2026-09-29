import React, { useEffect, useRef } from 'react';
import { TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { useSignupDraftStore, useSignupIdentity } from '@features/auth/model';
import { FORMATTED_PHONE_MAX_LENGTH, formatPhoneNumber } from '@features/auth/utils';
import { SignupStepLayout, SignupTextField } from '@features/auth/ui';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignupIdentity'>;

// 본인인증 정보 입력 (Figma 967:5842 → 970:6980) — 이름을 입력하고 "다음"을 누르면 휴대폰번호 칸이 위에 추가되고,
// 휴대폰번호까지 채워 "다음"을 누르면 인증번호를 발송한 뒤 인증번호 입력 화면으로 이동
export default function SignupIdentityScreen({ navigation }: Props) {
  const { step, isVisible, canProceed, handleNext, name, setName, phone, setPhone, isSendingCode, sendError } =
    useSignupIdentity(() => navigation.navigate('SignupVerifyCode'));

  const phoneRef = useRef<TextInput>(null);

  // 휴대폰번호 칸이 열리면 바로 입력할 수 있게 포커스
  useEffect(() => {
    if (step === 'phone') phoneRef.current?.focus();
  }, [step]);

  const handleClose = () => {
    useSignupDraftStore.getState().reset();
    navigation.popToTop();
  };

  return (
    <SignupStepLayout
      title={'본인인증을 위한\n정보를 입력해주세요.'}
      description={'원활한 서비스를 이용을 위해 한번 인증하는\n과정이 필요합니다.'}
      onClose={handleClose}
      buttonLabel="다음"
      onPressButton={handleNext}
      buttonDisabled={!canProceed}
      isLoading={isSendingCode}
      errorMessage={sendError}
    >
      <View className="mt-6 gap-6">
        {isVisible('phone') && (
          <SignupTextField
            ref={phoneRef}
            label="휴대폰번호"
            placeholder="010-0000-0000"
            keyboardType="number-pad"
            value={formatPhoneNumber(phone)}
            onChangeText={setPhone}
            maxLength={FORMATTED_PHONE_MAX_LENGTH}
            onSubmitEditing={handleNext}
          />
        )}

        <SignupTextField
          label="이름"
          placeholder="이름"
          value={name}
          onChangeText={setName}
          autoFocus
          returnKeyType="next"
          onSubmitEditing={handleNext}
        />
      </View>
    </SignupStepLayout>
  );
}
