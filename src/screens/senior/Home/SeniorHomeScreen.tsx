import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaringLogo } from '@shared/ui/AppHeader/CaringLogo';
import { useSessionStore } from '@shared/store/useSessionStore';
import { MOCK_WARDS, useWardFontScaleStore } from '@features/ward-management/model';
import { WardText } from '@features/ward-management/ui';
import { HealthRecordModal, WardHealthStatusCard } from '@features/health/ui';
import { WardScheduleCard } from '@features/schedule/ui';
import { WardMedicationCard } from '@features/medication/ui';

export function SeniorHomeScreen() {
  const [isHealthRecordVisible, setIsHealthRecordVisible] = useState(false);
  // 로그인된 WARD 계정 자신이 곧 wardId — 연동/복약스케줄 등 백엔드 API의 wardId는 WARD 역할
  // member의 memberId를 그대로 씀(별도 ward 테이블 없이 member.role=WARD가 그 자체로 어르신).
  // 실로그인 시 useSessionStore.profile.memberId에 실제 값이 들어있으므로 그대로 사용.
  const memberId = useSessionStore(state => state.profile?.memberId);
  const wardId = memberId != null ? String(memberId) : MOCK_WARDS[0].id;

  // 보호자가 돌봄대상자 관리 탭에서 설정한 글자 크기를 어르신 화면 전체에 반영
  useEffect(() => {
    const wardIdNumber = Number(wardId);
    if (!Number.isNaN(wardIdNumber)) {
      useWardFontScaleStore.getState().fetchFontScale(wardIdNumber);
    }
  }, [wardId]);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <CaringLogo size={44} />
        <Pressable
          onPress={() => useSessionStore.getState().requestLogout()}
          className="items-center justify-center rounded-card bg-primary px-4 py-2">
          <WardText size="base" className="font-pretendard-semibold text-white">
            로그아웃
          </WardText>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerClassName="gap-4 pb-8" showsVerticalScrollIndicator={false}>
        <WardHealthStatusCard wardId={wardId} onPressRecord={() => setIsHealthRecordVisible(true)} />

        <WardScheduleCard wardId={wardId} />

        <WardMedicationCard wardId={wardId} />
      </ScrollView>

      <HealthRecordModal
        visible={isHealthRecordVisible}
        wardId={wardId}
        onClose={() => setIsHealthRecordVisible(false)}
      />
    </SafeAreaView>
  );
}
