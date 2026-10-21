import React from 'react';
import { Pressable, Text } from 'react-native';
import ClockIcon from '@assets/icons/schedule/clock.svg';

interface TimeTriggerInputProps {
  placeholder: string;
  valueLabel?: string;
  onPress: () => void;
}

export function TimeTriggerInput({ placeholder, valueLabel, onPress }: TimeTriggerInputProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-md border border-border-input bg-surface px-3.5 py-2">
      <Text className={`font-pretendard text-lg ${valueLabel ? 'text-text-primary' : 'text-text-placeholder'}`}>
        {valueLabel ?? placeholder}
      </Text>
      <ClockIcon width={20} height={20} />
    </Pressable>
  );
}
