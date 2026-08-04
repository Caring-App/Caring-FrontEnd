import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import { AppHeader } from '@shared/ui';
import { useGuardianMenuStore } from '@features/guardian-menu/model';
import { DailyReportCard } from '@features/health/ui';
import { MedicationSection } from '@features/medication/ui';
import { LocationSection } from '@features/location/ui';
import { ScheduleSection } from '@features/schedule/ui';
import { WelfareSection } from '@features/welfare-facility/ui';
import { MOCK_WARDS, useSelectedWardStore } from '@features/ward-management/model';

type GuardianStackNavigationProp = NativeStackNavigationProp<GuardianStackParamList>;

export function GuardianHomeScreen() {
  const navigation = useNavigation();
  const stackNavigation = navigation.getParent<GuardianStackNavigationProp>();
  const selectedWardId = useSelectedWardStore(state => state.selectedWardId);
  const ward = MOCK_WARDS.find(item => item.id === selectedWardId) ?? MOCK_WARDS[0];

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <AppHeader
        onPressBell={() => stackNavigation?.navigate('Notification')}
        onPressMenu={() => useGuardianMenuStore.getState().open()}
      />
      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}>
        <DailyReportCard wardId={ward.id} wardName={ward.name} />
        <ScheduleSection wardId={ward.id} wardName={ward.name} />
        <MedicationSection wardId={ward.id} onPressMore={() => stackNavigation?.navigate('Medication')} />
        <LocationSection wardId={ward.id} onPressMore={() => stackNavigation?.navigate('Map')} />
        <WelfareSection onPressMore={() => stackNavigation?.navigate('WelfareFacilities')} />
      </ScrollView>
    </SafeAreaView>
  );
}
