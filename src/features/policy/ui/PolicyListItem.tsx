import React from 'react';
import { Pressable, Text } from 'react-native';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import { PolicySummary } from '../model';

export function PolicyListItem({ policy, onPress }: { policy: PolicySummary; onPress: () => void }) {
  return (
    <Pressable
      className="flex-row items-center justify-between border-b border-border py-3"
      onPress={onPress}>
      <Text className="text-lg font-pretendard-bold text-text-primary">{policy.title}</Text>
      <ChevronRightIcon width={24} height={24} />
    </Pressable>
  );
}
