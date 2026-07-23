import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import { MOCK_FAQS } from '@features/mypage/model';
import { FaqAccordionItem } from '@features/mypage/ui';

export function FaqScreen() {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={24} height={24} />
        </Pressable>
        <Text className="text-xl font-pretendard-semibold text-text-primary">자주묻는 질문</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {MOCK_FAQS.map(faq => (
          <FaqAccordionItem
            key={faq.id}
            faq={faq}
            expanded={expandedId === faq.id}
            onToggle={() => setExpandedId(prev => (prev === faq.id ? null : faq.id))}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
