import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import { WEEKDAY_LABELS_KO, addMonths, getCalendarWeeks, isSameDay } from '../model/calendarUtils';
import { ScheduleEntry } from '../model/scheduleRegistrationTypes';
import { useScheduleStore } from '../model/useScheduleStore';
import { MonthYearPickerModal } from './MonthYearPickerModal';
import { ScheduleDetailModal } from './ScheduleDetailModal';
import { DeleteScheduleConfirmModal } from './DeleteScheduleConfirmModal';

interface HomeScheduleCalendarProps {
  wardId: string;
  wardName: string;
  onRequestEdit: (schedule: ScheduleEntry) => void;
}

export function HomeScheduleCalendar({ wardId, wardName, onRequestEdit }: HomeScheduleCalendarProps) {
  const [month, setMonth] = useState(() => new Date());
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleEntry | null>(null);
  const [scheduleToDelete, setScheduleToDelete] = useState<ScheduleEntry | null>(null);

  const schedules = useScheduleStore((state) => state.schedulesByWard[wardId]) ?? [];

  const weeks = getCalendarWeeks(month).filter((week) => week.some(({ inCurrentMonth }) => inCurrentMonth));

  const findScheduleForDate = (date: Date) => schedules.find((entry) => isSameDay(entry.date, date)) ?? null;

  return (
    <View
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 32,
        elevation: 3,
      }}
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
            const scheduleForDate = inCurrentMonth ? findScheduleForDate(date) : null;
            const isToday = inCurrentMonth && isSameDay(date, new Date());
            return (
              <Pressable
                key={date.toISOString()}
                disabled={!scheduleForDate}
                onPress={() => setSelectedSchedule(scheduleForDate)}
                className="w-8 items-center pt-1">
                {inCurrentMonth && (
                  <>
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isToday ? '#FD7E14' : 'transparent',
                      }}>
                      <Text
                        className="font-pretendard-medium text-base"
                        style={{ color: isToday ? '#FFFFFF' : '#020202' }}>
                        {date.getDate()}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginTop: 3,
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: scheduleForDate ? '#8E8E93' : 'transparent',
                        backgroundColor: scheduleForDate ? '#8E8E93' : 'transparent',
                      }}
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
        visible={!!selectedSchedule}
        wardName={wardName}
        schedule={selectedSchedule}
        onClose={() => setSelectedSchedule(null)}
        onEdit={() => {
          if (selectedSchedule) {
            onRequestEdit(selectedSchedule);
          }
          setSelectedSchedule(null);
        }}
        onDelete={() => {
          setScheduleToDelete(selectedSchedule);
          setSelectedSchedule(null);
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
