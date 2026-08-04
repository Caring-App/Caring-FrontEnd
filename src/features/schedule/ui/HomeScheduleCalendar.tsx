import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import { WEEKDAY_LABELS_KO, addMonths, getCalendarWeeks, isSameDay } from '../model/calendarUtils';
import { ScheduleEntry } from '../model/scheduleRegistrationTypes';
import { useScheduleStore } from '../model/useScheduleStore';
import { MonthYearPickerModal } from './MonthYearPickerModal';
import { ScheduleDetailModal } from './ScheduleDetailModal';
import { DeleteScheduleConfirmModal } from './DeleteScheduleConfirmModal';

// tailwind.config.js의 text.calendarScheduleDot과 동일한 값 (borderRadius 이슈로 인라인 필요)
const SCHEDULE_DOT_COLOR = '#8E8E93';

interface HomeScheduleCalendarProps {
  wardId: string;
  wardName: string;
  onRequestEdit: (schedule: ScheduleEntry) => void;
}

export function HomeScheduleCalendar({ wardId, wardName, onRequestEdit }: HomeScheduleCalendarProps) {
  const [month, setMonth] = useState(() => new Date());
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [selectedSchedules, setSelectedSchedules] = useState<ScheduleEntry[]>([]);
  const [scheduleToDelete, setScheduleToDelete] = useState<ScheduleEntry | null>(null);

  const schedules = useScheduleStore((state) => state.schedulesByWard[wardId]) ?? [];

  const weeks = getCalendarWeeks(month).filter((week) => week.some(({ inCurrentMonth }) => inCurrentMonth));

  const findSchedulesForDate = (date: Date) => schedules.filter((entry) => isSameDay(entry.date, date));

  return (
    <View
      style={styles.card}
      className="mt-3 rounded-[15px] border border-border-calendarCard bg-white px-3.5 py-3.5">
      <View className="flex-row items-center justify-between">
        <Pressable onPress={() => setIsPickerVisible(true)}>
          <Text className="font-pretendard-semibold text-md text-text-calendarDay">
            {month.getFullYear()}년 {month.getMonth() + 1}월
          </Text>
        </Pressable>
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => setMonth((prev) => addMonths(prev, -1))} hitSlop={8}>
            <ChevronRightIcon width={13} height={13} style={{ transform: [{ rotate: '180deg' }] }} />
          </Pressable>
          <Pressable onPress={() => setMonth((prev) => addMonths(prev, 1))} hitSlop={8}>
            <ChevronRightIcon width={13} height={13} />
          </Pressable>
        </View>
      </View>

      <View className="mt-4 flex-row justify-between">
        {WEEKDAY_LABELS_KO.map((label) => (
          <Text key={label} className="w-8 text-center font-pretendard-semibold text-[10px] text-text-calendarWeekday">
            {label}
          </Text>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className="mt-1 flex-row justify-between">
          {week.map(({ date, inCurrentMonth }) => {
            const schedulesForDate = inCurrentMonth ? findSchedulesForDate(date) : [];
            const hasSchedule = schedulesForDate.length > 0;
            const isToday = inCurrentMonth && isSameDay(date, new Date());
            return (
              <Pressable
                key={date.toISOString()}
                disabled={!hasSchedule}
                onPress={() => setSelectedSchedules(schedulesForDate)}
                className="w-8 items-center pt-1">
                {inCurrentMonth && (
                  <>
                    <View
                      style={styles.todayCircle}
                      className={`items-center justify-center ${isToday ? 'bg-primary' : 'bg-transparent'}`}>
                      <Text
                        className={`font-pretendard-medium text-base ${
                          isToday ? 'text-white' : 'text-text-calendarDay'
                        }`}>
                        {date.getDate()}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.scheduleDot,
                        // eslint-disable-next-line react-native/no-inline-styles -- 일정 존재 여부에 따라 매 렌더마다 바뀌는 값이라 StyleSheet로 뺄 수 없음
                        {
                          borderColor: hasSchedule ? SCHEDULE_DOT_COLOR : 'transparent',
                          backgroundColor: hasSchedule ? SCHEDULE_DOT_COLOR : 'transparent',
                        },
                      ]}
                    />
                  </>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}

      <MonthYearPickerModal
        visible={isPickerVisible}
        year={month.getFullYear()}
        month={month.getMonth() + 1}
        onClose={() => setIsPickerVisible(false)}
        onConfirm={(year, selectedMonth) => {
          setMonth(new Date(year, selectedMonth - 1, 1));
          setIsPickerVisible(false);
        }}
      />

      <ScheduleDetailModal
        visible={selectedSchedules.length > 0}
        wardName={wardName}
        schedules={selectedSchedules}
        onClose={() => setSelectedSchedules([])}
        onEdit={(schedule) => {
          onRequestEdit(schedule);
          setSelectedSchedules([]);
        }}
        onDelete={(schedule) => {
          setScheduleToDelete(schedule);
          setSelectedSchedules([]);
        }}
      />

      <DeleteScheduleConfirmModal
        visible={!!scheduleToDelete}
        schedule={scheduleToDelete}
        onCancel={() => setScheduleToDelete(null)}
        onConfirm={() => {
          if (scheduleToDelete) {
            useScheduleStore.getState().deleteSchedule(wardId, scheduleToDelete.id);
          }
          setScheduleToDelete(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 3,
  },
  todayCircle: { width: 26, height: 26, borderRadius: 13 },
  scheduleDot: {
    marginTop: 3,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    // borderWidth 없이 borderRadius만 쓰면 사각형으로 렌더링되는 Fabric 이슈 우회
    borderWidth: 1,
  },
});
