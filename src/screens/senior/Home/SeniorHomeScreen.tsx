import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaringLogo } from '@shared/ui/AppHeader/CaringLogo';
import { useSessionStore } from '@shared/store/useSessionStore';
import { MOCK_WARDS } from '@features/ward-management/model';
import { HealthRecordModal, WardHealthStatusCard } from '@features/health/ui';
import { WardScheduleCard } from '@features/schedule/ui';
import { WardMedicationCard } from '@features/medication/ui';

// TODO: 실제 로그인 연동 전 — 로그인된 WARD 계정과 MOCK_WARDS를 잇는 세션 정보가 아직 없어
// 첫 번째 mock 어르신을 "나"로 고정해서 씀
const CURRENT_WARD = MOCK_WARDS[0];

export function SeniorHomeScreen() {
  const [isHealthRecordVisible, setIsHealthRecordVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <CaringLogo size={44} />
        <Pressable
          onPress={() => useSessionStore.getState().requestLogout()}
          className="items-center justify-center rounded-card bg-primary px-4 py-2">
          <Text className="font-pretendard-semibold text-base text-white">로그아웃</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerClassName="gap-4 pb-8" showsVerticalScrollIndicator={false}>
        <WardHealthStatusCard wardId={CURRENT_WARD.id} onPressRecord={() => setIsHealthRecordVisible(true)} />

        <WardScheduleCard wardId={CURRENT_WARD.id} />

        <WardMedicationCard wardId={CURRENT_WARD.id} />
      </ScrollView>

      <HealthRecordModal
        visible={isHealthRecordVisible}
        wardId={CURRENT_WARD.id}
        onClose={() => setIsHealthRecordVisible(false)}
      />
    </SafeAreaView>
  );
}
