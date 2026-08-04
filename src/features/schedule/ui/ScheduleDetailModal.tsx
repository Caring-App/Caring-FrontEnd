import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CalendarEventIcon from '@assets/icons/section/calendar-event.svg';
import CloseIcon from '@assets/icons/action/close-x.svg';
import { ScheduleEntry } from '../model/scheduleRegistrationTypes';
import { formatScheduleDateTime } from '../model/scheduleFormat';

// 목록의 View에 준 gap-3(0.75rem)과 동일한 값
const LIST_GAP = 12;
const VISIBLE_ITEM_COUNT = 2;

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
  onLayout,
}: {
  schedule: ScheduleEntry;
  onEdit: (schedule: ScheduleEntry) => void;
  onDelete: (schedule: ScheduleEntry) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}) {
  return (
    <View onLayout={onLayout} className="rounded-card border border-border p-3.5">
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
  const [itemHeight, setItemHeight] = useState<number | null>(null);

  useEffect(() => {
    if (schedules.length > 0) {
      setDisplaySchedules(schedules);
    }
  }, [schedules]);

  // 목록(날짜)이 바뀌면 이전 측정값은 무효화하고 다시 측정한다
  useEffect(() => {
    setItemHeight(null);
  }, [displaySchedules]);

  if (displaySchedules.length === 0) {
    return null;
  }

  const needsScroll = displaySchedules.length > VISIBLE_ITEM_COUNT;
  // ScrollView가 이미 렌더된 뒤 maxHeight를 바꾸면 스크롤 영역이 제대로 갱신되지 않는
  // 경우가 있어, 실제 목록을 그리기 전에 첫 항목 높이를 화면 밖에서 먼저 측정해둔다.
  const isMeasuring = needsScroll && itemHeight === null;
  const listMaxHeight = needsScroll && itemHeight ? itemHeight * VISIBLE_ITEM_COUNT + LIST_GAP : undefined;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/30 px-5">
        {/* 배경(탭하면 닫힘)과 카드를 형제로 분리 — 카드를 Pressable로 감싸면 안의 ScrollView가 터치를 제대로 못 받음 */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View className="max-h-[80%] w-full rounded-card border border-border bg-surface px-4 pb-6 pt-6">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <CalendarEventIcon width={20} height={20} />
              <Text className="font-pretendard-bold text-xl text-text-primary">{wardName}님 일정</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8} className="-mt-1">
              <CloseIcon width={16} height={16} />
            </Pressable>
          </View>

          {isMeasuring ? (
            <View style={styles.hiddenMeasure} pointerEvents="none">
              <ScheduleDetailItem
                schedule={displaySchedules[0]}
                onEdit={onEdit}
                onDelete={onDelete}
                onLayout={(event) => setItemHeight(event.nativeEvent.layout.height)}
              />
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={needsScroll}
              scrollEnabled={needsScroll}
              style={listMaxHeight ? { maxHeight: listMaxHeight } : undefined}>
              <View className="gap-3">
                {displaySchedules.map((schedule) => (
                  <ScheduleDetailItem key={schedule.id} schedule={schedule} onEdit={onEdit} onDelete={onDelete} />
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  hiddenMeasure: { position: 'absolute', left: 0, right: 0, opacity: 0 },
});
