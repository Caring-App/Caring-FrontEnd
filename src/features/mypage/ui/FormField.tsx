import React from 'react';
import { TextInput } from 'react-native';
import { FormField as SharedFormField } from '@shared/ui';
import { colors } from '@shared/theme/colors';

export function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'phone-pad';
}) {
  return (
    <SharedFormField label={label} containerClassName="gap-2">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        className="rounded-[6px] border border-border-input px-3 py-2 text-lg text-text-body"
      />
    </SharedFormField>
  );
}
