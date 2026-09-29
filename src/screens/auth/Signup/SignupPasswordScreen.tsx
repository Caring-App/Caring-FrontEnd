import React, { useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { useSignupDraftStore } from '@features/auth/model';
import { AuthStepLayout, AuthTextField } from '@features/auth/ui';
import { isValidPassword, PASSWORD_RULE_MESSAGE } from '@features/auth/utils';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignupPassword'>;

// 비밀번호 설정 (Figma 970:7578)
export default function SignupPasswordScreen({ navigation }: Props) {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const isPasswordValid = isValidPassword(password);
  const isConfirmMatched = password === passwordConfirm;
  const canProceed = isPasswordValid && isConfirmMatched;

  const handleNext = () => {
    if (!canProceed) return;
    useSignupDraftStore.getState().setPassword(password, passwordConfirm);
    navigation.navigate('SignupAddress');
  };

  const handleClose = () => {
    useSignupDraftStore.getState().reset();
    navigation.popToTop();
  };

  return (
    <AuthStepLayout
      title="비밀번호를 입력해주세요"
      description={PASSWORD_RULE_MESSAGE}
      onClose={handleClose}
      buttonLabel="다음"
      onPressButton={handleNext}
      buttonDisabled={!canProceed}
    >
      <View className="mt-6 gap-4">
        <AuthTextField
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoFocus
          errorMessage={password && !isPasswordValid ? `${PASSWORD_RULE_MESSAGE}으로 입력해 주세요.` : undefined}
        />
        <AuthTextField
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 한번 입력하세요"
          secureTextEntry
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          onSubmitEditing={handleNext}
          errorMessage={passwordConfirm && !isConfirmMatched ? '비밀번호가 일치하지 않습니다.' : undefined}
        />
      </View>
    </AuthStepLayout>
  );
}
