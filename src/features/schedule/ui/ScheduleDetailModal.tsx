import React, { useEffect, useState } from 'react';
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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/30 px-5" onPress={onClose}>
        <Pressable className="w-full rounded-card border border-border bg-surface px-4 pb-6 pt-6" onPress={() => {}}>
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <CalendarEventIcon width={20} height={20} />
              <Text className="font-pretendard-bold text-xl text-text-primary">{wardName}님 일정</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8} className="-mt-1">
              <CloseIcon width={16} height={16} />
            </Pressable>
          </View>

          <View className="gap-2 rounded-card border border-border p-3.5">
            <Text className="font-pretendard-semibold text-lg text-text-body">{formatScheduleDateTime(displaySchedule)}</Text>
            <Text className="font-pretendard-semibold text-lg text-text-body">{displaySchedule.location}</Text>
            <Text className="font-pretendard-semibold text-lg text-text-body">{displaySchedule.title}</Text>
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
