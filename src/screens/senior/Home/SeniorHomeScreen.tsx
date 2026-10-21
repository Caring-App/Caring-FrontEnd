import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaringLogo } from '@shared/ui/AppHeader/CaringLogo';
import { useSessionStore } from '@shared/store/useSessionStore';
import { confirmLogout } from '@shared/model';
import { WardText } from '@shared/ui';
import { MOCK_WARDS, fetchWardFontScale } from '@features/ward-management/model';
import { useStepSync } from '@features/health/model';
import { HealthRecordModal, StepSyncNotice, WardHealthStatusCard } from '@features/health/ui';
import { WardScheduleCard } from '@features/schedule/ui';
import { WardMedicationCard } from '@features/medication/ui';
import { useWardLinkStatus } from '@features/account-link/model';
import { WardNoLinkNotice } from '@features/account-link/ui';

export function SeniorHomeScreen() {
  const [isHealthRecordVisible, setIsHealthRecordVisible] = useState(false);
  // 오늘 걸음 수를 Health Connect에서 읽어 서버로 보냄(보호자 하루 요약 레포트용)
  const stepSync = useStepSync();
  // 보호자와 연동 안 된 계정이면 메인 카드 대신 연동 안내 — 조회 전·실패 시엔 메인 화면 그대로
  const linkStatus = useWardLinkStatus();
  // 로그인된 WARD 계정 자신이 곧 wardId — 연동/복약스케줄 등 백엔드 API의 wardId는 WARD 역할
  // member의 memberId를 그대로 씀(별도 ward 테이블 없이 member.role=WARD가 그 자체로 어르신).
  // 실로그인 시 useSessionStore.profile.memberId에 실제 값이 들어있으므로 그대로 사용.
  const memberId = useSessionStore(state => state.profile?.memberId);
  const wardId = memberId != null ? String(memberId) : MOCK_WARDS[0].id;

  // 보호자가 돌봄대상자 관리 탭에서 설정한 글자 크기를 어르신 화면 전체에 반영
  useEffect(() => {
    const wardIdNumber = Number(wardId);
    if (!Number.isNaN(wardIdNumber)) {
      fetchWardFontScale(wardIdNumber);
    }
  }, [wardId]);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <CaringLogo size={44} />
        <Pressable
          onPress={() => confirmLogout()}
          className="items-center justify-center rounded-card bg-primary px-4 py-2">
          <WardText size="base" className="font-pretendard-semibold text-white">
            로그아웃
          </WardText>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerClassName="gap-4 pb-8" showsVerticalScrollIndicator={false}>
        {linkStatus.status === 'unlinked' ? (
          <WardNoLinkNotice onLinked={linkStatus.markLinked} />
        ) : (
          <>
            <WardHealthStatusCard wardId={wardId} onPressRecord={() => setIsHealthRecordVisible(true)} />

            <StepSyncNotice status={stepSync.status} onPressFix={stepSync.fixAccess} />

            <WardScheduleCard />

            <WardMedicationCard />
          </>
        )}
      </ScrollView>

      <HealthRecordModal
        visible={isHealthRecordVisible}
        onClose={() => setIsHealthRecordVisible(false)}
      />
    </SafeAreaView>
  );
}
