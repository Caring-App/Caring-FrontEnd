import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import { MOCK_POLICIES } from '@features/mypage/model';

export function PolicyScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={24} height={24} />
        </Pressable>
        <Text className="text-xl font-pretendard-semibold text-text-primary">정책 및 약관</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {MOCK_POLICIES.map(policy => (
          <Pressable
            key={policy.id}
            className="flex-row items-center justify-between border-b border-border py-3"
            onPress={() => {}}>
            <Text className="text-lg font-pretendard-bold text-text-primary">{policy.title}</Text>
            <ChevronRightIcon width={24} height={24} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
