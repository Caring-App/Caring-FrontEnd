import React from 'react';
import { Pressable, Text, PressableProps } from 'react-native';

type ButtonVariant = 'primary' | 'outline';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
}

const CONTAINER_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-primary rounded-card items-center justify-center py-4',
  outline: 'bg-surface border border-border rounded-card items-center justify-center py-4',
};

const LABEL_STYLES: Record<ButtonVariant, string> = {
  primary: 'text-surface text-md font-semibold',
  outline: 'text-text-strong text-md font-semibold',
};

export function Button({ label, variant = 'primary', ...pressableProps }: ButtonProps) {
  return (
    <Pressable className={CONTAINER_STYLES[variant]} {...pressableProps}>
      <Text className={LABEL_STYLES[variant]}>{label}</Text>
    </Pressable>
  );
}
