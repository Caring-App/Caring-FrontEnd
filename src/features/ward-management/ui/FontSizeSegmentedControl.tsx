import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { FontSizeOption } from '../model';

const FONT_SIZE_OPTIONS: { value: FontSizeOption; label: string }[] = [
  { value: 'small', label: '작게' },
  { value: 'medium', label: '보통' },
  { value: 'large', label: '크게' },
];

export function FontSizeSegmentedControl({
  value,
  onChange,
}: {
  value: FontSizeOption;
  onChange: (value: FontSizeOption) => void;
}) {
  return (
    <View className="w-[180px] flex-row items-center justify-between rounded-full bg-surface-subtle px-1 py-1">
      {FONT_SIZE_OPTIONS.map(option => {
        const isSelected = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={`rounded-full px-3 py-1 ${isSelected ? 'bg-surface' : ''}`}>
            <Text
              className={`text-sm ${
                isSelected
                  ? 'font-pretendard-semibold text-text-primary'
                  : 'font-pretendard-medium text-text-disabled'
              }`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
