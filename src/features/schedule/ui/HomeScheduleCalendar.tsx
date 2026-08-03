import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import { WEEKDAY_LABELS_KO, addMonths, getCalendarWeeks } from '../model/calendarUtils';
import { MonthYearPickerModal } from './MonthYearPickerModal';

export function HomeScheduleCalendar() {
  const [month, setMonth] = useState(() => new Date());
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const weeks = getCalendarWeeks(month).filter((week) => week.some(({ inCurrentMonth }) => inCurrentMonth));

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
          {week.map(({ date, inCurrentMonth }) => (
            <View key={date.toISOString()} className="h-8 w-8 items-center justify-center">
              {inCurrentMonth && (
                <Text className="font-pretendard-medium text-base text-text-calendarDay">{date.getDate()}</Text>
              )}
            </View>
          ))}
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
    </View>
  );
}
