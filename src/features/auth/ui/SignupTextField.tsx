import React, { forwardRef } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '@shared/theme/colors';

// 회원가입 리뉴얼 회색 입력창 (Figma 967:6586 Text Input — #F5F5F5 / radius 12 / 높이 54.5)
const SIGNUP_INPUT_CLASSNAME =
  'h-[55px] rounded-card bg-surface-signupInput px-4 font-pretendard text-md text-black';

export function SignupFieldLabel({ children }: { children: string }) {
  return <Text className="mb-2 font-pretendard-bold text-base leading-[21px] text-text-signupTitle">{children}</Text>;
}

interface SignupTextFieldProps extends TextInputProps {
  label: string;
  // 입력창 오른쪽 안쪽에 겹쳐 띄울 요소(인증번호 타이머 등)
  rightElement?: React.ReactNode;
  errorMessage?: string;
}

export const SignupTextField = forwardRef<TextInput, SignupTextFieldProps>(
  ({ label, rightElement, errorMessage, ...inputProps }, ref) => (
    <View>
      <SignupFieldLabel>{label}</SignupFieldLabel>
      <View className="justify-center">
        <TextInput
          ref={ref}
          className={`${SIGNUP_INPUT_CLASSNAME} ${rightElement ? 'pr-16' : ''}`}
          placeholderTextColor={colors.textSignupPlaceholder}
          {...inputProps}
        />
        {rightElement && <View className="absolute right-4">{rightElement}</View>}
      </View>
      {!!errorMessage && <Text className="mt-1.5 text-xs text-text-danger">{errorMessage}</Text>}
    </View>
  ),
);

SignupTextField.displayName = 'SignupTextField';
