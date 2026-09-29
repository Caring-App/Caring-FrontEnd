import React, { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import PrescriptionIcon from '@assets/icons/section/prescription2.svg';
import CapsuleOnIcon from '@assets/icons/medication/capsule-on.svg';
import CapsuleOffIcon from '@assets/icons/medication/capsule-off.svg';
import { ConfirmModal } from '@shared/ui';
import { colors } from '@shared/theme/colors';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, 어르신 글자 크기 배율은
// ward-management가 유일한 소스라(useWardFontScaleStore) 이 화면에서도 그대로 가져다 씀
// (순환참조 없음, ward-management는 medication을 참조하지 않음).
import { WardText } from '@features/ward-management/ui';
import { MealType, useTodayPills } from '../model';
import { MEAL_TYPE_LABELS, MEAL_TYPES } from '../utils';

// 돌봄대상자 메인 화면의 "복약 관리" 카드. 오늘 복약 기록은 서버(/api/pill/today) 기준이라 매일 새로 시작하고,
// 보호자가 꺼둔 시간대·오늘 복용 요일이 아닌 시간대는 흐리게 표시되며 누를 수 없음.
// 복용 확인은 되돌릴 수 없어서(서버에 취소 API 없음) 누르면 한 번 더 확인받음
export function WardMedicationCard() {
  const { pillsBySlot, isLoading, confirmingSlot, confirmPill, error } = useTodayPills();
  const [pendingSlot, setPendingSlot] = useState<MealType | null>(null);

  const handleConfirm = () => {
    if (pendingSlot) confirmPill(pendingSlot);
    setPendingSlot(null);
  };

  return (
    <View className="rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <PrescriptionIcon width={20} height={20} />
        <WardText size="xl" className="font-pretendard-bold text-text-primary">
          복약 관리
        </WardText>
      </View>

      <View className="mt-4 rounded-card border border-border bg-surface p-4">
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <View className="flex-row justify-around">
            {MEAL_TYPES.map(slot => {
              const pills = pillsBySlot[slot] ?? [];
              const isScheduled = pills.length > 0;
              const isTaken = isScheduled && pills.every(pill => pill.taken);
              return (
                <Pressable
                  key={slot}
                  onPress={() => setPendingSlot(slot)}
                  disabled={!isScheduled || isTaken || confirmingSlot !== null}
                  className={`items-center gap-1 ${isScheduled ? '' : 'opacity-30'}`}
                  accessibilityState={{ disabled: !isScheduled || isTaken, checked: isTaken }}>
                  <WardText size="md" className="font-pretendard-semibold text-text-primary">
                    {MEAL_TYPE_LABELS[slot]}
                  </WardText>
                  <View className="h-[60px] w-[60px] items-center justify-center">
                    {confirmingSlot === slot ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : isTaken ? (
                      <CapsuleOnIcon width={60} height={60} />
                    ) : (
                      <CapsuleOffIcon width={60} height={60} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
        {!!error && (
          <WardText size="sm" className="mt-3 text-center text-text-danger">
            {error}
          </WardText>
        )}
      </View>

      <ConfirmModal
        visible={pendingSlot !== null}
        title={pendingSlot ? `${MEAL_TYPE_LABELS[pendingSlot]} 약을 드셨나요?` : ''}
        subtitle="확인을 누르면 보호자에게 복용 완료 알림이 가요. 확인 후에는 되돌릴 수 없어요."
        cancelLabel="아니요"
        confirmLabel="먹었어요"
        onCancel={() => setPendingSlot(null)}
        onConfirm={handleConfirm}
      />
    </View>
  );
}
