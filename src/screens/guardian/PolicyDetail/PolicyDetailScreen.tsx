import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { GuardianStackParamList } from '@app/navigation/types';
import { colors } from '@shared/theme/colors';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import { usePolicyStore } from '@features/policy/model';
import { formatPolicyUpdatedAt } from '@features/policy/utils';

type PolicyDetailRouteProp = RouteProp<GuardianStackParamList, 'PolicyDetail'>;

export function PolicyDetailScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<PolicyDetailRouteProp>();
  const detail = usePolicyStore(state => state.detailsByType[params.type]);
  const hasError = usePolicyStore(state => state.errorTypes.has(params.type));
  const fetchPolicyDetail = usePolicyStore(state => state.fetchPolicyDetail);

  useFocusEffect(
    useCallback(() => {
      fetchPolicyDetail(params.type);
    }, [fetchPolicyDetail, params.type]),
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={24} height={24} />
        </Pressable>
        <Text className="text-xl font-pretendard-semibold text-text-primary">{detail?.title ?? '정책 및 약관'}</Text>
      </View>

      {!detail && hasError ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm font-pretendard-medium text-text-muted">
            정책 내용을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </Text>
        </View>
      ) : !detail ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerClassName="py-4" showsVerticalScrollIndicator={false}>
          <Text className="text-xs font-pretendard-medium text-text-muted">
            최종 수정일 {formatPolicyUpdatedAt(detail.updatedAt)}
          </Text>
          <Text className="mt-3 text-md font-pretendard-medium leading-6 text-text-body">{detail.content}</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
