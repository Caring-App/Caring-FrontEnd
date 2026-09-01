import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import { colors } from '@shared/theme/colors';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import { usePolicyStore } from '@features/policy/model';
import { PolicyListItem } from '@features/policy/ui';

type GuardianStackNavigationProp = NativeStackNavigationProp<GuardianStackParamList>;

export function PolicyScreen() {
  const navigation = useNavigation<GuardianStackNavigationProp>();
  const policies = usePolicyStore(state => state.policies);
  const isLoadingList = usePolicyStore(state => state.isLoadingList);
  const hasListError = usePolicyStore(state => state.hasListError);
  const fetchPolicies = usePolicyStore(state => state.fetchPolicies);

  useFocusEffect(
    useCallback(() => {
      fetchPolicies();
    }, [fetchPolicies]),
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={24} height={24} />
        </Pressable>
        <Text className="text-xl font-pretendard-semibold text-text-primary">정책 및 약관</Text>
      </View>

      {isLoadingList && policies.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : hasListError && policies.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm font-pretendard-medium text-text-muted">
            정책 및 약관을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </Text>
        </View>
      ) : policies.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm font-pretendard-medium text-text-muted">정책 및 약관이 없어요.</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {policies.map(policy => (
            <PolicyListItem
              key={policy.type}
              policy={policy}
              onPress={() => navigation.navigate('PolicyDetail', { type: policy.type })}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
