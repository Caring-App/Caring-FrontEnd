import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import { useInquiryStore } from '@features/inquiry/model';
import { InquiryListItem } from '@features/inquiry/ui';
import { colors } from '@shared/theme/colors';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';

type GuardianStackNavigationProp = NativeStackNavigationProp<GuardianStackParamList>;

// 문의하기 — 게시판 형식. 내가 쓴 문의 목록(최신순)과 답변 상태를 보고, 새 문의를 작성하거나 상세로 들어감
export function InquiryScreen() {
  const navigation = useNavigation<GuardianStackNavigationProp>();
  const inquiries = useInquiryStore(state => state.inquiries);
  const isLoading = useInquiryStore(state => state.isLoading);
  const hasLoaded = useInquiryStore(state => state.hasLoaded);
  const hasLoadFailed = useInquiryStore(state => state.hasLoadFailed);

  // 작성하고 돌아왔거나 그 사이 답변이 달렸을 수 있어서 화면에 들어올 때마다 다시 조회
  useFocusEffect(
    useCallback(() => {
      useInquiryStore.getState().fetchInquiries();
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={24} height={24} />
        </Pressable>
        <Text className="text-xl font-pretendard-semibold text-text-primary">문의하기</Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && hasLoaded}
            onRefresh={() => useInquiryStore.getState().fetchInquiries()}
            colors={[colors.primary]}
          />
        }>
        <Text className="mt-4 text-xl font-pretendard-bold text-text-primary">도움이 필요하신가요?</Text>
        <Text className="mb-4 mt-2 text-md font-pretendard-medium text-text-muted">
          궁금하신 점이나 불편 사항을 문의로 남겨주시면 확인 후 답변드릴게요.
        </Text>

        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-lg font-pretendard-bold text-text-primary">내 문의 내역</Text>
          <Pressable className="rounded-[8px] bg-primary px-3 py-2" onPress={() => navigation.navigate('InquiryWrite')}>
            <Text className="text-sm font-pretendard-semibold text-surface">문의 작성하기</Text>
          </Pressable>
        </View>

        <View className="mt-2 border-t border-border-divider">
          {!hasLoaded && isLoading ? (
            <ActivityIndicator className="py-10" size="small" color={colors.primary} />
          ) : inquiries.length === 0 ? (
            // 조회 실패를 "작성한 문의 없음"으로 보이지 않게 구분(이전에 받아둔 목록이 있으면 그대로 보여줌)
            <Text className="py-10 text-center text-md font-pretendard-medium text-text-muted">
              {hasLoadFailed ? '문의 목록을 불러오지 못했어요. 아래로 당겨 다시 시도해 주세요.' : '아직 작성한 문의가 없어요.'}
            </Text>
          ) : (
            inquiries.map(inquiry => (
              <InquiryListItem
                key={inquiry.inquiryId}
                inquiry={inquiry}
                onPress={() => navigation.navigate('InquiryDetail', { inquiryId: inquiry.inquiryId })}
              />
            ))
          )}
        </View>

        <Pressable className="mt-6 items-center" onPress={() => navigation.navigate('Faq')}>
          <Text className="border-b border-border-link text-sm font-pretendard-medium text-text-link">
            자주 묻는 질문
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
