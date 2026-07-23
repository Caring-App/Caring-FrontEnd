import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';

type GuardianStackNavigationProp = NativeStackNavigationProp<GuardianStackParamList>;

export function InquiryScreen() {
  const navigation = useNavigation<GuardianStackNavigationProp>();

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={24} height={24} />
        </Pressable>
        <Text className="text-xl font-bold text-text-primary">문의하기</Text>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        <Text className="mt-4 text-xl font-pretendard-bold text-text-primary">도움이 필요하신가요?</Text>
        <Text className="mt-2 text-md font-pretendard-medium text-text-muted">
          궁금하신 점이나 불편 사항이 있을 경우 고객센터로 연락주시면 친절히 도와드리겠습니다. 운영시간
          이외에는 자주묻는질문 또는 1:1 문의를 이용해 주세요.
        </Text>

        <View className="mt-4 gap-1 rounded-card border border-border p-3">
          <Text className="text-md font-pretendard-bold text-text-heading">
            ※앱 관련 문의 운영시간 안내
          </Text>
          <Text className="text-md font-pretendard-medium text-text-muted">
            월-금 08:00 ~ 17:00 (주말 및 공휴일 휴무)
          </Text>
          <Text className="text-md font-pretendard-medium text-text-muted">점심시간 12:00 ~ 13:00</Text>
        </View>

        <View className="mt-4 flex-row gap-3">
          <View className="flex-1 items-center gap-2 rounded-card border border-border py-4">
            <Text className="text-md font-pretendard-bold text-text-heading">일반 문의</Text>
            <Text className="text-lg font-pretendard-bold text-text-primary">(4321-1234)</Text>
          </View>
          <View className="flex-1 items-center gap-2 rounded-card border border-border py-4">
            <Text className="text-md font-pretendard-bold text-text-heading">앱 관련 문의</Text>
            <Text className="text-lg font-pretendard-bold text-text-primary">(1234-4321)</Text>
          </View>
        </View>

        <Pressable
          className="mt-6 items-center justify-center rounded-card bg-primary py-4"
          onPress={() => navigation.navigate('InquiryChat')}>
          <Text className="text-md font-pretendard-semibold text-surface">1:1 문의하기</Text>
        </Pressable>

        <Pressable className="mt-3 items-center" onPress={() => navigation.navigate('Faq')}>
          <Text className="border-b border-border-link text-sm font-pretendard-medium text-text-link">
            자주 묻는 질문
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
