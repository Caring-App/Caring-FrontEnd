import React from 'react';
import { Pressable, Text, View } from 'react-native';
import ChevronDownIcon from '@assets/icons/action/chevron-down.svg';
import { FaqItem } from '../model';

export function FaqAccordionItem({
  faq,
  expanded,
  onToggle,
}: {
  faq: FaqItem;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable className="border-b border-border py-4" onPress={onToggle}>
      <Text className="text-2xs font-pretendard-medium text-text-muted">{faq.category}</Text>
      <View className="mt-1 flex-row items-start justify-between gap-2">
        <Text className="flex-1 text-2xl font-pretendard-bold text-text-primary">
          Q. {faq.question}
        </Text>
        <View className="mt-1.5" style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}>
          <ChevronDownIcon width={13} height={9} />
        </View>
      </View>
      {expanded && (
        <Text className="mt-3 text-md font-pretendard-medium text-text-muted">A. {faq.answer}</Text>
      )}
    </Pressable>
  );
}
