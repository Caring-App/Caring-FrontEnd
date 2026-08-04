import React from 'react';
import { Pressable, Text, View } from 'react-native';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import { WEEKDAY_LABELS_KO, getCalendarWeeks, isSameDay } from '../model/calendarUtils';

interface ScheduleCalendarPickerProps {
  month: Date;
  selectedDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date) => void;
}

export function ScheduleCalendarPicker({
  month,
  selectedDate,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
}: ScheduleCalendarPickerProps) {
  const weeks = getCalendarWeeks(month);

  return (
    <View className="rounded-card border border-border bg-surface">
      <View className="flex-row items-center justify-between border-b border-border-divider px-3 py-2.5">
        <Pressable onPress={onPrevMonth} hitSlop={8} className="h-6 w-6 items-center justify-center">
          <ChevronRightIcon width={16} height={16} style={{ transform: [{ rotate: '180deg' }] }} />
        </Pressable>
        <Text className="font-pretendard-semibold text-md text-text-primary">
          {month.getFullYear()}년 {month.getMonth() + 1}월
        </Text>
        <Pressable onPress={onNextMonth} hitSlop={8} className="h-6 w-6 items-center justify-center">
          <ChevronRightIcon width={16} height={16} />
        </Pressable>
      </View>

      <View className="px-3 py-2">
        <View className="flex-row justify-between">
          {WEEKDAY_LABELS_KO.map((label) => (
            <Text key={label} className="w-9 text-center font-pretendard-medium text-xs text-text-calendarMuted">
              {label}
            </Text>
          ))}
        </View>

        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} className="flex-row justify-between py-0.5">
            {week.map(({ date, inCurrentMonth }) => {
              const selected = isSameDay(date, selectedDate);
              return (
                <Pressable
                  key={date.toISOString()}
                  onPress={() => onSelectDate(date)}
                  className="h-9 w-9 items-center justify-center">
                  <View className={`h-7 w-7 items-center justify-center rounded-full ${selected ? 'bg-primary' : ''}`}>
                    <Text
                      className={`font-pretendard-medium text-sm ${
                        selected ? 'text-white' : inCurrentMonth ? 'text-text-primary' : 'text-text-calendarMuted'
                      }`}>
                      {date.getDate()}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <View className="items-center border-t border-border-divider py-2.5">
        <Text className="font-pretendard-semibold text-sm text-primary">
          {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
        </Text>
      </View>
    </View>
  );
}
