import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useMedicationStore } from '@features/medication/model';
import CapsuleOnIcon from '@assets/icons/medication/capsule-on.svg';
import CapsuleOffIcon from '@assets/icons/medication/capsule-off.svg';
import { SeniorMedicationSlotProps } from '../types/senior';

export function SeniorMedicationSlot({ label, slot }: SeniorMedicationSlotProps) {
  const taken = useMedicationStore(state => state.taken[slot]);
  // 💡 기존에 정의된 상태 변경 함수 사용 (보통 setTaken 등을 제공합니다)
  const setTaken = useMedicationStore(state => state.setTaken);

  // 클릭할 때 현재 상태의 반대로 값을 토글해서 저장
  const handleToggle = () => {
    setTaken(slot, !taken);
  };

  return (
    <Pressable onPress={handleToggle} className="items-center gap-1">
      <Text className="text-sm font-semibold text-text-primary">{label}</Text>
      <View
        className={`h-[65px] w-[65px] items-center justify-center rounded-card border ${
          taken ? 'bg-primary-100 border-primary-500' : 'bg-surface border-border'
        }`}>
        {taken ? <CapsuleOnIcon width={38} height={38} /> : <CapsuleOffIcon width={38} height={38} />}
      </View>
    </Pressable>
  );
}