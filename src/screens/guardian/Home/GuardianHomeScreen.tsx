import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import { AppHeader } from '@shared/ui';
import { colors } from '@shared/theme/colors';
import { useGuardianMenuStore } from '@features/guardian-menu/model';
import { DailyReportCard } from '@features/health/ui';
import { MedicationSection } from '@features/medication/ui';
import { LocationSection } from '@features/location/ui';
import { ScheduleSection } from '@features/schedule/ui';
import { WelfareSection } from '@features/welfare-facility/ui';
import { useSelectedWardStore } from '@features/ward-management/model';
import {
  MEDICATION_MODAL_STEP_INDEX,
  TOUR_STEPS,
  useTourScrollTracking,
  useTourStore,
} from '@features/guardian-tour/model';
import { TourOverlay, TourTarget } from '@features/guardian-tour/ui';

type GuardianStackNavigationProp = NativeStackNavigationProp<GuardianStackParamList>;

const CHART_STEP_INDEX = TOUR_STEPS.findIndex(step => step.targetId === 'dailyReport.chart');
const WARD_MANAGEMENT_STEP_INDEX = TOUR_STEPS.findIndex(step => step.screen === 'WardManagement');

export function GuardianHomeScreen() {
  const navigation = useNavigation();
  const stackNavigation = navigation.getParent<GuardianStackNavigationProp>();
  const selectedWardId = useSelectedWardStore(state => state.selectedWardId);
  const wards = useSelectedWardStore(state => state.wards);
  const isWardsLoaded = useSelectedWardStore(state => state.isLoaded);
  const ward = wards.find(item => item.id === selectedWardId) ?? wards[0];
  const tourScroll = useTourScrollTracking('home');

  useEffect(() => {
    if (!isWardsLoaded) {
      useSelectedWardStore.getState().fetchWards();
    }
  }, [isWardsLoaded]);

  const isTourActive = useTourStore(state => state.isActive);
  const tourStepIndex = useTourStore(state => state.currentStepIndex);
  // 사용가이드가 "건강 수치 그래프" 단계에 도달하면, 접혀 있던 상세 영역을 강제로 펼쳐서 보여줌
  const forceShowDetail = isTourActive && CHART_STEP_INDEX !== -1 && tourStepIndex === CHART_STEP_INDEX;

  // 회원가입 직후 자동 시작뿐 아니라, 마이페이지 > 사용 가이드 안내에서 다시 보기로 진입한 경우에도
  // Home 탭이 포커스될 때마다 확인해야 하므로 mount 시점이 아닌 focus 시점에 체크함
  useFocusEffect(
    useCallback(() => {
      if (useTourStore.getState().shouldAutoStart) {
        useTourStore.getState().start();
      }
    }, []),
  );

  // 사용가이드가 "복약 등록" 단계에 도달하면 복약 관리 화면으로 자동 이동함(그 화면의 등록 모달을 열어서 보여줘야 하므로)
  useEffect(() => {
    if (isTourActive && MEDICATION_MODAL_STEP_INDEX !== -1 && tourStepIndex === MEDICATION_MODAL_STEP_INDEX) {
      stackNavigation?.navigate('Medication');
    }
  }, [isTourActive, tourStepIndex, stackNavigation]);

  // 사용가이드가 "돌봄 대상자 관리" 단계에 도달하면 그 탭으로 자동 이동함
  useEffect(() => {
    if (isTourActive && WARD_MANAGEMENT_STEP_INDEX !== -1 && tourStepIndex === WARD_MANAGEMENT_STEP_INDEX) {
      stackNavigation?.navigate('Tabs', { screen: 'WardManagement' });
    }
  }, [isTourActive, tourStepIndex, stackNavigation]);

  // 어르신 목록 로드 전(mock) → 로드 후(실제 연동)로 selectedWardId가 바뀔 수 있는데, 그 사이에
  // LocationSection의 NaverMapView가 key={wardId}로 이미 마운트돼있으면 바로 리마운트되면서
  // 네이티브 쪽 레이스 컨디션으로 크래시남("Index 0 out of bounds for length 0" in RNCNaverMapViewManager).
  // 목록이 확정된 뒤에만 화면을 그려서 지도가 최종 wardId로 한 번만 마운트되게 함.
  if (!isWardsLoaded) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface" edges={['top']}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <AppHeader
        onPressBell={() => stackNavigation?.navigate('Notification')}
        onPressMenu={() => useGuardianMenuStore.getState().open()}
      />
      <ScrollView
        ref={tourScroll.ref}
        className="flex-1 px-4"
        contentContainerClassName="pb-8"
        // 사용가이드 중엔 하단 안내 카드가 화면 상당 부분을 가려서, 맨 아래쪽 섹션들은 기본 여백만으론
        // 카드 위로 끌어올릴 스크롤 여유가 부족함 — 화면 높이만큼 여백을 더 얹어 항상 충분하게 함
        contentContainerStyle={isTourActive ? { paddingBottom: Dimensions.get('window').height } : undefined}
        showsVerticalScrollIndicator={false}
        {...tourScroll.scrollHandlers}>
        <DailyReportCard wardId={ward.id} wardName={ward.name} forceShowDetail={forceShowDetail} />
        <TourTarget id="schedule.section" className="mt-4">
          <ScheduleSection wardId={ward.id} wardName={ward.name} />
        </TourTarget>
        <TourTarget id="medication.section" className="mt-4">
          <MedicationSection wardId={ward.id} onPressMore={() => stackNavigation?.navigate('Medication')} />
        </TourTarget>
        <TourTarget id="location.section" className="mt-4">
          <LocationSection wardId={ward.id} onPressMore={() => stackNavigation?.navigate('Map')} />
        </TourTarget>
        <TourTarget id="welfare.section" className="mt-4">
          <WelfareSection onPressMore={() => stackNavigation?.navigate('WelfareFacilities')} />
        </TourTarget>
      </ScrollView>
      <TourOverlay />
    </SafeAreaView>
  );
}
