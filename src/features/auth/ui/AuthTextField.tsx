import React, { forwardRef } from 'react';
import { ActivityIndicator, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { colors } from '@shared/theme/colors';

// 회원가입 리뉴얼 회색 입력창 (Figma 967:6586 Text Input — #F5F5F5 / radius 12 / 높이 54.5)
const AUTH_INPUT_CLASSNAME =
  'h-[55px] rounded-card bg-surface-authInput px-4 font-pretendard text-md text-black';

export function AuthFieldLabel({ children }: { children: string }) {
  return <Text className="mb-2 font-pretendard-bold text-base leading-[21px] text-text-authTitle">{children}</Text>;
}

interface SideButton {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

interface AuthTextFieldProps extends TextInputProps {
  label: string;
  // 입력창 오른쪽 안쪽에 겹쳐 띄울 요소(인증번호 타이머 등)
  rightElement?: React.ReactNode;
  // 입력창 옆에 붙는 주황 버튼(인증 요청/확인 등, Figma 970:7677 주소 "검색" 버튼과 같은 스타일)
  sideButton?: SideButton;
  errorMessage?: string;
  // 에러가 아닌 안내 문구(인증 완료 등) — 주황색으로 표시
  helperMessage?: string;
}

export const AuthTextField = forwardRef<TextInput, AuthTextFieldProps>(
  ({ label, rightElement, sideButton, errorMessage, helperMessage, ...inputProps }, ref) => (
    <View>
      <AuthFieldLabel>{label}</AuthFieldLabel>
      <View className="flex-row gap-2">
        <View className="flex-1 justify-center">
          <TextInput
            ref={ref}
            className={`${AUTH_INPUT_CLASSNAME} ${rightElement ? 'pr-16' : ''}`}
            placeholderTextColor={colors.textAuthPlaceholder}
            {...inputProps}
          />
          {rightElement && <View className="absolute right-4">{rightElement}</View>}
        </View>
        {sideButton && (
          <TouchableOpacity
            className={`min-w-[100px] items-center justify-center rounded-card px-5 ${
              sideButton.disabled ? 'bg-authButtonDisabled' : 'bg-primary'
            }`}
            onPress={sideButton.onPress}
            disabled={sideButton.disabled || sideButton.isLoading}
            activeOpacity={0.8}
          >
            {sideButton.isLoading ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <Text
                className={`font-pretendard-bold text-base ${sideButton.disabled ? 'text-text-authDesc' : 'text-white'}`}
              >
                {sideButton.label}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
      {errorMessage ? (
        <Text className="mt-1.5 text-xs text-text-danger">{errorMessage}</Text>
      ) : (
        !!helperMessage && <Text className="mt-1.5 text-xs text-primary">{helperMessage}</Text>
      )}
    </View>
  ),
);

AuthTextField.displayName = 'AuthTextField';
