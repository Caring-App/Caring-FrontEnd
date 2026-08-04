import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import CalendarEventIcon from '@assets/icons/section/calendar-event.svg';
import CloseIcon from '@assets/icons/action/close-x.svg';
import { ScheduleEntry } from '../model/scheduleRegistrationTypes';
import { formatScheduleDateTime } from '../model/scheduleFormat';

interface ScheduleDetailModalProps {
  visible: boolean;
  wardName: string;
  schedules: ScheduleEntry[];
  onClose: () => void;
  onEdit: (schedule: ScheduleEntry) => void;
  onDelete: (schedule: ScheduleEntry) => void;
}

function ScheduleDetailItem({
  schedule,
  onEdit,
  onDelete,
}: {
  schedule: ScheduleEntry;
  onEdit: (schedule: ScheduleEntry) => void;
  onDelete: (schedule: ScheduleEntry) => void;
}) {
  return (
    <View className="rounded-card border border-border p-3.5">
      <View className="gap-2">
        <Text className="font-pretendard-semibold text-lg text-text-body">{formatScheduleDateTime(schedule)}</Text>
        <Text className="font-pretendard-semibold text-lg text-text-body">{schedule.location}</Text>
        <Text className="font-pretendard-semibold text-lg text-text-body">{schedule.title}</Text>
      </View>

      <View className="mt-4 flex-row justify-center gap-2">
        <Pressable onPress={() => onEdit(schedule)} className="items-center justify-center rounded-md bg-primary px-6 py-2">
          <Text className="font-pretendard-semibold text-base text-white">일정 수정</Text>
        </Pressable>
        <Pressable onPress={() => onDelete(schedule)} className="items-center justify-center rounded-md bg-primary px-6 py-2">
          <Text className="font-pretendard-semibold text-base text-white">일정 삭제</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function ScheduleDetailModal({ visible, wardName, schedules, onClose, onEdit, onDelete }: ScheduleDetailModalProps) {
  // 닫히는 순간 schedules가 바로 비워지므로 fade-out 동안엔 마지막 값을 유지
  const [displaySchedules, setDisplaySchedules] = useState(schedules);

  useEffect(() => {
    if (schedules.length > 0) {
      setDisplaySchedules(schedules);
    }
  }, [schedules]);

  if (displaySchedules.length === 0) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/30 px-5" onPress={onClose}>
        <Pressable className="max-h-[80%] w-full rounded-card border border-border bg-surface px-4 pb-6 pt-6" onPress={() => {}}>
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <CalendarEventIcon width={20} height={20} />
              <Text className="font-pretendard-bold text-xl text-text-primary">{wardName}님 일정</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8} className="-mt-1">
              <CloseIcon width={16} height={16} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-3">
              {displaySchedules.map((schedule) => (
                <ScheduleDetailItem key={schedule.id} schedule={schedule} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
