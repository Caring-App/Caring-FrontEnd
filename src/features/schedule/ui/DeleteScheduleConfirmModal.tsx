import React, { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { ScheduleEntry } from '../model/scheduleRegistrationTypes';
import { formatScheduleDateTimeShort } from '../model/scheduleFormat';

interface DeleteScheduleConfirmModalProps {
  visible: boolean;
  schedule: ScheduleEntry | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteScheduleConfirmModal({ visible, schedule, onCancel, onConfirm }: DeleteScheduleConfirmModalProps) {
  // schedule은 닫는 액션과 같은 타이밍에 null이 되므로, fade-out 애니메이션이 끝날 때까지는
  // 마지막으로 보여준 값을 그대로 유지한다 (바로 null을 반환하면 Modal이 애니메이션 없이 즉시 사라짐).
  const [displaySchedule, setDisplaySchedule] = useState(schedule);

  useEffect(() => {
    if (schedule) {
      setDisplaySchedule(schedule);
    }
  }, [schedule]);

  if (!displaySchedule) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable className="flex-1 items-center justify-center bg-black/30 px-5" onPress={onCancel}>
        <Pressable className="w-full rounded-card border border-border bg-surface px-4 pb-6 pt-6" onPress={() => {}}>
          <Text className="text-xl font-pretendard-bold text-text-primary">일정을 삭제 하시겠어요?</Text>
          <Text className="mt-2 text-xs font-pretendard-medium text-text-muted">
            {formatScheduleDateTimeShort(displaySchedule)} - {displaySchedule.location}
          </Text>

          <View className="mt-6 flex-row gap-4">
            <Pressable
              className="flex-1 items-center justify-center rounded-[8px] bg-buttonMuted py-4"
              onPress={onCancel}>
              <Text className="text-2xl font-pretendard-semibold text-surface">취소</Text>
            </Pressable>
            <Pressable className="flex-1 items-center justify-center rounded-[8px] bg-primary py-4" onPress={onConfirm}>
              <Text className="text-2xl font-pretendard-semibold text-surface">삭제</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
