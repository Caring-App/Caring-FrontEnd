import React from 'react';
import { Pressable, View } from 'react-native';
import PrescriptionIcon from '@assets/icons/section/prescription2.svg';
import CapsuleOnIcon from '@assets/icons/medication/capsule-on.svg';
import CapsuleOffIcon from '@assets/icons/medication/capsule-off.svg';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, 어르신 글자 크기 배율은
// ward-management가 유일한 소스라(useWardFontScaleStore) 이 화면에서도 그대로 가져다 씀
// (순환참조 없음, ward-management는 medication을 참조하지 않음).
import { WardText } from '@features/ward-management/ui';
import { MealSlot, useMedicationStore } from '../model';

const MEAL_SLOTS: { slot: MealSlot; label: string }[] = [
  { slot: 'morning', label: '아침' },
  { slot: 'lunch', label: '점심' },
  { slot: 'dinner', label: '저녁' },
];

// 돌봄대상자 메인 화면의 "복약 관리" 카드. 어르신이 직접 눌러서 복용 여부를 체크하면
// useMedicationStore를 통해 보호자 화면(MedicationSection)에 그대로 반영됨
export function WardMedicationCard({ wardId }: { wardId: string }) {
  const taken = useMedicationStore(state => state.takenByWard[wardId]);

  return (
    <View className="rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <PrescriptionIcon width={20} height={20} />
        <WardText size="xl" className="font-pretendard-bold text-text-primary">
          복약 관리
        </WardText>
      </View>

      <View className="mt-4 rounded-card border border-border bg-surface p-4">
        <View className="flex-row justify-around">
          {MEAL_SLOTS.map(({ slot, label }) => (
            <Pressable
              key={slot}
              onPress={() => useMedicationStore.getState().setTaken(wardId, slot, !taken?.[slot])}
              className="items-center gap-1">
              <WardText size="md" className="font-pretendard-semibold text-text-primary">
                {label}
              </WardText>
              <View className="h-[60px] w-[60px] items-center justify-center">
                {taken?.[slot] ? (
                  <CapsuleOnIcon width={60} height={60} />
                ) : (
                  <CapsuleOffIcon width={60} height={60} />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
