import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import CalendarEventIcon from '@assets/icons/section/calendar-event.svg';
import CloseIcon from '@assets/icons/action/close-x.svg';
import { ScheduleEntry } from '../model/scheduleRegistrationTypes';
import { formatScheduleDateTime } from '../model/scheduleFormat';

interface ScheduleDetailModalProps {
  visible: boolean;
  wardName: string;
  schedule: ScheduleEntry | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ScheduleDetailModal({ visible, wardName, schedule, onClose, onEdit, onDelete }: ScheduleDetailModalProps) {
  if (!schedule) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/30 px-5" onPress={onClose}>
        <Pressable className="w-full rounded-card border border-border bg-surface p-4" onPress={() => {}}>
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <CalendarEventIcon width={20} height={20} />
              <Text className="font-pretendard-bold text-xl text-text-primary">{wardName}님 일정</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <CloseIcon width={16} height={16} />
            </Pressable>
          </View>

          <View className="gap-2 rounded-card border border-border p-3.5">
            <Text className="font-pretendard-semibold text-lg text-text-body">{formatScheduleDateTime(schedule)}</Text>
            <Text className="font-pretendard-semibold text-lg text-text-body">{schedule.location}</Text>
            <Text className="font-pretendard-semibold text-lg text-text-body">{schedule.title}</Text>
          </View>

          <View className="mt-4 flex-row justify-center gap-2">
            <Pressable onPress={onEdit} className="items-center justify-center rounded-md bg-primary px-6 py-2">
              <Text className="font-pretendard-semibold text-base text-white">일정 수정</Text>
            </Pressable>
            <Pressable onPress={onDelete} className="items-center justify-center rounded-md bg-primary px-6 py-2">
              <Text className="font-pretendard-semibold text-base text-white">일정 삭제</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
