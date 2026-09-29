import React from 'react';
import { Text, View } from 'react-native';
import { MealSlot, TodayMedicationStatus, useSyncWardTodayMedication, useWardTodayMedication } from '@features/medication/model';
import { SectionCard, AddButton } from '@shared/ui';
import PrescriptionIcon from '@assets/icons/section/prescription2.svg';
import CapsuleOnIcon from '@assets/icons/medication/capsule-on.svg';
import CapsuleOffIcon from '@assets/icons/medication/capsule-off.svg';

// 보호자 홈 "복약 관리" — 어르신의 오늘 시간대별 복용 여부. 오늘 먹을 약이 없는 시간대(꺼져 있거나 복용 요일이 아님)는 흐리게 표시
export function MedicationSection({
  wardId,
  wardName,
  onPressMore,
}: {
  wardId: string;
  wardName: string;
  onPressMore?: () => void;
}) {
  useSyncWardTodayMedication(wardId);
  const statusBySlot = useWardTodayMedication(wardId, wardName);

  return (
    <SectionCard
      title="복약 관리"
      icon={<PrescriptionIcon width={20} height={20} />}
      action={<AddButton label="복약 관리" onPress={onPressMore} />}
      className="">
      <View className="mt-3 flex-row justify-around">
        {MEAL_SLOTS.map(({ slot, label }) => (
          <MedicationSlot key={slot} label={label} status={statusBySlot[slot]} />
        ))}
      </View>
    </SectionCard>
  );
}

const MEAL_SLOTS: { slot: MealSlot; label: string }[] = [
  { slot: 'morning', label: '아침' },
  { slot: 'lunch', label: '점심' },
  { slot: 'dinner', label: '저녁' },
];

function MedicationSlot({ label, status }: { label: string; status: TodayMedicationStatus }) {
  const taken = status === 'taken';

  return (
    <View className={`items-center gap-1 ${status === 'notScheduled' ? 'opacity-30' : ''}`}>
      <Text className="text-sm font-semibold text-text-primary">{label}</Text>
      <View className="h-[60px] w-[60px] items-center justify-center">
        {taken ? <CapsuleOnIcon width={36} height={36} /> : <CapsuleOffIcon width={36} height={36} />}
      </View>
    </View>
  );
}
