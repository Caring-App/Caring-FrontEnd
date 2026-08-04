import React from 'react';
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
  if (!schedule) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable className="flex-1 items-center justify-center bg-black/30 px-5" onPress={onCancel}>
        <Pressable className="w-full rounded-card border border-border bg-surface p-4" onPress={() => {}}>
          <Text className="text-xl font-pretendard-bold text-text-primary">일정을 삭제 하시겠어요?</Text>
          <Text className="mt-2 text-xs font-pretendard-medium text-text-muted">
            {formatScheduleDateTimeShort(schedule)} - {schedule.location}
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
