import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import { AppHeader } from '@shared/ui';
import { useGuardianMenuStore } from '@features/guardian-menu/model';
import { useHealthStatusStore, HealthStatus } from '@features/health/model';
import { useMedicationStore, MealSlot, MedicationTaken } from '@features/medication/model';
import { getWardLocation } from '@features/location/model';
import { MOCK_WARDS, useSelectedWardStore } from '@features/ward-management/model';
import { DetailLinkText } from '@features/welfare-facility/ui';
import { NaverMapView, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import EnvelopeFillIcon from '@assets/icons/report/envelope-fill.svg';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import EmojiSmileOnIcon from '@assets/icons/emoji/emoji-smile-on.svg';
import EmojiSmileOffIcon from '@assets/icons/emoji/emoji-smile-off.svg';
import EmojiNeutralOnIcon from '@assets/icons/emoji/emoji-neutral-on.svg';
import EmojiNeutralOffIcon from '@assets/icons/emoji/emoji-neutral-off.svg';
import EmojiTearOnIcon from '@assets/icons/emoji/emoji-tear-on.svg';
import EmojiTearOffIcon from '@assets/icons/emoji/emoji-tear-off.svg';
import CalendarEventIcon from '@assets/icons/section/calendar-event.svg';
import PrescriptionIcon from '@assets/icons/section/prescription2.svg';
import GeoAltFillIcon from '@assets/icons/section/geo-alt-fill.svg';
import BuildingFillIcon from '@assets/icons/section/building-fill.svg';
import CapsuleOnIcon from '@assets/icons/medication/capsule-on.svg';
import CapsuleOffIcon from '@assets/icons/medication/capsule-off.svg';
import nationalSubsidyImage from '@assets/images/welfare/national-subsidy.png';
import healthWelfareImage from '@assets/images/welfare/health-welfare.png';

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
        <ScheduleSection onPressMore={() => stackNavigation?.navigate('Schedule')} />
        <MedicationSection wardId={ward.id} onPressMore={() => stackNavigation?.navigate('Medication')} />
        <LocationSection wardId={ward.id} onPressMore={() => stackNavigation?.navigate('Map')} />
        <WelfareSection onPressMore={() => stackNavigation?.navigate('WelfareFacilities')} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionCard({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View className="mt-4 rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className="text-md font-bold text-text-primary">{title}</Text>
        </View>
        {action}
      </View>
      {children}
    </View>
  );
}

const HEALTH_EMOJI_ICONS: Record<HealthStatus, { on: typeof EmojiSmileOnIcon; off: typeof EmojiSmileOnIcon }> = {
  good: { on: EmojiSmileOnIcon, off: EmojiSmileOffIcon },
  normal: { on: EmojiNeutralOnIcon, off: EmojiNeutralOffIcon },
  bad: { on: EmojiTearOnIcon, off: EmojiTearOffIcon },
};

const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  good: '좋음',
  normal: '보통',
  bad: '안좋음',
};

const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
  morning: '아침',
  lunch: '점심',
  dinner: '저녁',
};

function buildDailySummary(wardName: string, status: HealthStatus | null, taken: MedicationTaken | undefined) {
  if (!status || !taken) {
    return '아직 오늘의 요약 정보가 없어요.';
  }

  const missedSlot = (['morning', 'lunch', 'dinner'] as MealSlot[]).find(slot => !taken[slot]);
  const medicationClause = missedSlot
    ? `${wardName}님은 오늘 ${MEAL_SLOT_LABELS[missedSlot]}약을 복용하지 않았어요`
    : `${wardName}님은 오늘 약을 모두 잘 복용했어요`;

  return `${wardName}님의 오늘 건강 상태는 '${HEALTH_STATUS_LABELS[status]}' 이에요! ${medicationClause}`;
}

function DailyReportCard({ wardId, wardName }: { wardId: string; wardName: string }) {
  const [showDetail, setShowDetail] = useState(false);
  const status = useHealthStatusStore(state => state.statusByWard[wardId] ?? null);
  const taken = useMedicationStore(state => state.takenByWard[wardId]);

  return (
    <View className="mt-4 rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <Pressable onPress={() => setShowDetail(prev => !prev)} hitSlop={8}>
          <ChevronRightIcon width={18} height={18} />
        </Pressable>
        <EnvelopeFillIcon width={20} height={15} />
        <Text className="text-xl font-bold text-text-primary">하루 요약 레포트</Text>
      </View>
      <Text className="mt-1 text-xs text-text-muted">
        하루 요약 레포트는 설정한 시간을 기준으로 반영됩니다
      </Text>

      <View className="mt-4 rounded-card border border-border bg-surface p-4">
        <Text className="text-md font-semibold text-text-primary">오늘의 건강 상태</Text>
        <View className="mt-3 flex-row justify-around">
          <EmojiState wardId={wardId} status="good" />
          <EmojiState wardId={wardId} status="normal" />
          <EmojiState wardId={wardId} status="bad" />
        </View>
      </View>

      <View className="mt-3 rounded-card border border-border bg-surface p-4">
        <Text className="text-md font-semibold text-text-primary">오늘 하루 요약</Text>
        <Text className="mt-2 text-sm text-text-primary">{buildDailySummary(wardName, status, taken)}</Text>
      </View>

      {showDetail && <CompoundHealthDataSection />}
    </View>
  );
}

function EmojiState({ wardId, status }: { wardId: string; status: HealthStatus }) {
  const activeStatus = useHealthStatusStore(state => state.statusByWard[wardId]);
  const { on: OnIcon, off: OffIcon } = HEALTH_EMOJI_ICONS[status];
  const isOn = activeStatus === status;

  return (
    <View className="h-[85px] w-[85px] items-center justify-center rounded-card bg-surface">
      {isOn ? <OnIcon width={60} height={60} /> : <OffIcon width={60} height={60} />}
    </View>
  );
}

function CompoundHealthDataSection() {
  return (
    <View className="mt-3 rounded-card border border-border bg-surface p-4">
      <Text className="text-md font-semibold text-text-primary">건강 수치 그래프</Text>
      {/* TODO: 실제 차트 라이브러리로 최근 혈당 수치 등 그래프 연동 필요 */}
      <View className="mt-3 items-center justify-center rounded-card border border-border bg-surface py-10">
        <Text className="text-sm text-text-muted">복합 건강 데이터 (준비 중)</Text>
      </View>
    </View>
  );
}

function AddButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-1 rounded-card border border-border bg-surface px-3 py-1.5">
      <Text className="text-xs font-semibold text-text-strong">+ {label}</Text>
    </Pressable>
  );
}

function ScheduleSection({ onPressMore }: { onPressMore?: () => void }) {
  return (
    <SectionCard
      title="일정 관리"
      icon={<CalendarEventIcon width={20} height={20} />}
      action={<AddButton label="일정 등록" onPress={onPressMore} />}>
      {/* TODO: features/schedule 실제 캘린더 컴포넌트로 교체 */}
      <Pressable
        onPress={onPressMore}
        className="mt-3 items-center justify-center rounded-card border border-border bg-surface py-10">
        <Text className="text-sm text-text-muted">캘린더 (준비 중, 눌러서 일정 관리로 이동)</Text>
      </Pressable>
    </SectionCard>
  );
}

function MedicationSection({ wardId, onPressMore }: { wardId: string; onPressMore?: () => void }) {
  return (
    <SectionCard
      title="복약 관리"
      icon={<PrescriptionIcon width={20} height={20} />}
      action={<AddButton label="복약 관리" onPress={onPressMore} />}>
      <View className="mt-3 flex-row justify-around">
        <MedicationSlot wardId={wardId} label="아침" slot="morning" />
        <MedicationSlot wardId={wardId} label="점심" slot="lunch" />
        <MedicationSlot wardId={wardId} label="저녁" slot="dinner" />
      </View>
    </SectionCard>
  );
}

function MedicationSlot({ wardId, label, slot }: { wardId: string; label: string; slot: MealSlot }) {
  const taken = useMedicationStore(state => state.takenByWard[wardId]?.[slot]);

  return (
    <View className="items-center gap-1">
      <Text className="text-sm font-semibold text-text-primary">{label}</Text>
      <View className="h-[60px] w-[60px] items-center justify-center">
        {taken ? <CapsuleOnIcon width={36} height={36} /> : <CapsuleOffIcon width={36} height={36} />}
      </View>
    </View>
  );
}

function LocationSection({ wardId, onPressMore }: { wardId: string; onPressMore?: () => void }) {
  const location = getWardLocation(wardId);

  return (
    <SectionCard title="위치 GPS" icon={<GeoAltFillIcon width={15} height={20} />}>
      <View className="relative mt-3 overflow-hidden rounded-card border border-border">
        <NaverMapView
          key={wardId}
          style={{ height: 160 }}
          initialCamera={{
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: 15,
          }}
          isScrollGesturesEnabled={false}
          isZoomGesturesEnabled={false}
          isTiltGesturesEnabled={false}
          isRotateGesturesEnabled={false}
          isStopGesturesEnabled={false}
          isShowLocationButton={false}>
          <NaverMapMarkerOverlay latitude={location.latitude} longitude={location.longitude} />
        </NaverMapView>
        <Pressable onPress={onPressMore} className="absolute inset-0" />
      </View>
    </SectionCard>
  );
}

function WelfareSection({ onPressMore }: { onPressMore?: () => void }) {
  return (
    <SectionCard
      title="주변 공공 복지 시설"
      icon={<BuildingFillIcon width={15} height={20} />}
      action={<DetailLinkText onPress={onPressMore} />}>
      {/* TODO: features/location 실제 위치 기반 공공 시설 추천 API 연동. 아래 두 배너는
          고정 안내용이라 자세히 보기 리스트와 별개임. */}
      <View className="mt-3 gap-2">
        <View className="h-14 w-full flex-row items-center overflow-hidden rounded-card border border-border pl-3">
          <Image source={nationalSubsidyImage} style={{ width: 185, height: 40 }} resizeMode="contain" />
        </View>
        <View className="h-14 w-full flex-row items-center overflow-hidden rounded-card border border-border pl-3">
          <Image source={healthWelfareImage} style={{ width: 177, height: 34 }} resizeMode="contain" />
        </View>
      </View>
    </SectionCard>
  );
}
