import React from 'react';
import { TextInput } from 'react-native';
import { FormField as SharedFormField } from '@shared/ui';
import { colors } from '@shared/theme/colors';

// 마이페이지(내 정보 수정)와 달리 "돌봄대상자의 정보 수정" 맥락이라 라벨 스타일을 의도적으로 다르게 둠
export function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'phone-pad';
}) {
  return (
    <SharedFormField
      label={label}
      containerClassName="gap-2"
      labelClassName="text-md font-pretendard-semibold text-text-strong"
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        keyboardType={keyboardType}
        className="rounded-[6px] border border-border-input px-3 py-2 text-base text-text-primary"
      />
    </SharedFormField>
  );
}
