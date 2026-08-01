import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import { AppHeader } from '@shared/ui';
import { useHealthStatusStore, HealthStatus } from '@features/health/model';
import { useMedicationStore, MealSlot } from '@features/medication/model';
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
import CapsuleOnIcon from '@assets/icons/medication/capsule-on.svg';
import CapsuleOffIcon from '@assets/icons/medication/capsule-off.svg';
import { MedicationRegistrationModal } from '../../../features/medication/components/MedicationRegistrationModal';
import { useGuardianMenuStore } from '@features/guardian-menu/model';
import { MOCK_WARDS, useSelectedWardStore } from '@features/ward-management/model';

type GuardianStackNavigationProp = NativeStackNavigationProp<GuardianStackParamList>;

export function GuardianHomeScreen() {
  const navigation = useNavigation();
  const stackNavigation = navigation.getParent<GuardianStackNavigationProp>();
  const selectedWardId = useSelectedWardStore(state => state.selectedWardId);
  const ward = MOCK_WARDS.find(item => item.id === selectedWardId) ?? MOCK_WARDS[0];

  const [isModalVisible, setIsModalVisible] = useState(false);

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
        <DailyReportCard />
        <ScheduleSection onPressMore={() => stackNavigation?.navigate('Schedule')} />
        
        {/* 복약 등록 버튼 클릭 시 모달 열기 상태 변경 */}
        <MedicationSection onPressMore={() => setIsModalVisible(true)} />
        
        <LocationSection onPressMore={() => stackNavigation?.navigate('Map')} />
        <WelfareSection onPressMore={() => stackNavigation?.navigate('WelfareFacilities')} />
      </ScrollView>

      {/* 복약 등록 모달 */}
      <MedicationRegistrationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={(data) => {
          console.log('저장된 복약 정보:', data);
          setIsModalVisible(false);
        }}
      />
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

function DailyReportCard() {
  const [showDetail, setShowDetail] = useState(false);

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
          <EmojiState status="good" />
          <EmojiState status="normal" />
          <EmojiState status="bad" />
        </View>
      </View>

      <View className="mt-3 rounded-card border border-border bg-surface p-4">
        <Text className="text-md font-semibold text-text-primary">오늘 하루 요약</Text>
        <Text className="mt-2 text-sm text-text-primary">아직 오늘의 요약 정보가 없어요.</Text>
      </View>

      {showDetail && <CompoundHealthDataSection />}
    </View>
  );
}

interface EmojiStateProps {
  status: HealthStatus;
}

function EmojiState({ status }: EmojiStateProps) {
  const activeStatus = useHealthStatusStore((state: any) => state.status ?? state);
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
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
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
      <Pressable
        onPress={onPressMore}
        className="mt-3 items-center justify-center rounded-card border border-border bg-surface py-10">
        <Text className="text-sm text-text-muted">캘린더 (준비 중, 눌러서 일정 관리로 이동)</Text>
      </Pressable>
    </SectionCard>
  );
}

function MedicationSection({ onPressMore }: { onPressMore?: () => void }) {
  return (
    <SectionCard
      title="복약 관리"
      icon={<PrescriptionIcon width={20} height={20} />}
      action={<AddButton label="복약 등록" onPress={onPressMore} />}>
      <View className="mt-3 flex-row justify-around">
        <MedicationSlot label="아침" slot="morning" />
        <MedicationSlot label="점심" slot="lunch" />
        <MedicationSlot label="저녁" slot="dinner" />
      </View>
    </SectionCard>
  );
}

function MedicationSlot({ label, slot }: { label: string; slot: MealSlot }) {
  const taken = useMedicationStore((state: any) => state.taken?.[slot] ?? false);

  return (
    <View className="items-center gap-1">
      <Text className="text-sm font-semibold text-text-primary">{label}</Text>
      <View
        className={`h-[60px] w-[60px] items-center justify-center rounded-card ${
          taken ? 'bg-primary-100' : 'bg-surface'
        }`}>
        {taken ? <CapsuleOnIcon width={36} height={36} /> : <CapsuleOffIcon width={36} height={36} />}
      </View>
    </View>
  );
}

function LocationSection({ onPressMore }: { onPressMore?: () => void }) {
  return (
    <SectionCard title="위치 GPS" icon={<GeoAltFillIcon width={15} height={20} />}>
      <Pressable
        onPress={onPressMore}
        className="mt-3 items-center justify-center rounded-card border border-border bg-surface py-16">
        <Text className="text-sm text-text-muted">지도 (준비 중, 눌러서 위치 확인으로 이동)</Text>
      </Pressable>
    </SectionCard>
  );
}

function WelfareSection({ onPressMore }: { onPressMore?: () => void }) {
  return (
    <SectionCard title="주변 공공 복지 시설">
      <View className="mt-3 gap-2">
        <Pressable onPress={onPressMore} className="rounded-card border border-border bg-surface px-4 py-3">
          <Text className="text-sm font-semibold text-text-strong">국가지원금 확인하기</Text>
          <Text className="mt-1 text-xs text-text-muted">우리 부모님을 위한 지원금 체크</Text>
        </Pressable>
        <Pressable onPress={onPressMore} className="rounded-card border border-border bg-surface px-4 py-3">
          <Text className="text-sm font-semibold text-text-strong">보건복지부 지원 서비스 확인</Text>
        </Pressable>
      </View>
    </SectionCard>
  );
}