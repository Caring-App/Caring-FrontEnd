import React from 'react';
import { Text, View } from 'react-native';
import { useMedicationStore, MealSlot } from '@features/medication/model';
import { SectionCard, AddButton } from '@shared/ui';
import PrescriptionIcon from '@assets/icons/section/prescription2.svg';
import CapsuleOnIcon from '@assets/icons/medication/capsule-on.svg';
import CapsuleOffIcon from '@assets/icons/medication/capsule-off.svg';

export function MedicationSection({ wardId, onPressMore }: { wardId: string; onPressMore?: () => void }) {
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
