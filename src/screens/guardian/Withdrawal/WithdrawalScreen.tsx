import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import { WITHDRAW_REASONS } from '@features/mypage/model';
import { RadioOption } from '@features/mypage/ui';

export function WithdrawalScreen() {
  const navigation = useNavigation();
  const [reasonId, setReasonId] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const canWithdraw = agreed && reasonId !== null;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={24} height={24} />
        </Pressable>
        <Text className="text-xl font-pretendard-semibold text-text-primary">회원 탈퇴</Text>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        <Text className="mt-4 text-xl font-pretendard-bold text-text-primary">탈퇴 시 유의사항 안내</Text>
        <Text className="mt-1 text-xs font-pretendard-medium text-text-muted">
          회원 탈퇴를 신청하기 전에 아래의 유의사항을 확인해 주세요.
        </Text>

        <View className="mt-4 rounded-card border border-border p-3">
          <Text className="text-md font-pretendard-bold text-text-heading">회원 탈퇴 시 처리내용</Text>
          <Text className="mt-2 text-xs font-pretendard-medium text-text-muted">
            탈퇴 시 보호자님이 관리하시던 돌봄대상자의 복약 일정, 건강 기록 등 모든 케어 데이터가 즉시
            삭제되며 복구가 불가능합니다.
          </Text>
        </View>

        <View className="mt-4 gap-1 rounded-card border border-border p-3">
          <Text className="text-md font-pretendard-bold text-text-heading">
            탈퇴 사유  <Text className="text-xs font-pretendard text-text-danger">(필수)</Text>
          </Text>
          <View className="mt-2">
            {WITHDRAW_REASONS.map(reason => (
              <RadioOption
                key={reason.id}
                label={reason.label}
                selected={reasonId === reason.id}
                onPress={() => setReasonId(reason.id)}
              />
            ))}
          </View>
        </View>

        <Pressable
          className="mt-4 flex-row items-center gap-2"
          onPress={() => setAgreed(prev => !prev)}
          hitSlop={4}>
          <View
            className="h-4 w-4 items-center justify-center rounded-[2px] border"
            style={{
              backgroundColor: agreed ? '#FF7F00' : 'transparent',
              borderColor: agreed ? '#FF7F00' : '#E2E5E5',
            }}>
            {agreed && <Text className="text-[10px] leading-none text-surface">✓</Text>}
          </View>
          <Text className="text-xs font-pretendard-medium text-text-muted">
            위 내용을 모두 확인하였습니다.  <Text className="text-text-danger">필수</Text>
          </Text>
        </Pressable>

        <Pressable
          disabled={!canWithdraw}
          className="mt-6 items-center justify-center rounded-card bg-primary py-4"
          style={{ opacity: canWithdraw ? 1 : 0.4 }}>
          <Text className="text-2xl font-pretendard-semibold text-surface">탈퇴하기</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
