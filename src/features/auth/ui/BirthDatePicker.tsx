import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { colors } from '@shared/theme/colors';
import { BirthDatePickerProps } from '../model/types';

// 달력 한국어 설정
LocaleConfig.locales['kr'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'kr';

// YYYY-MM-DD 포맷 변환 함수
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function BirthDatePicker({ value, onChange }: BirthDatePickerProps) {
  // 선택된 날짜 문자열 관리
  const [selectedDate, setSelectedDate] = useState<string>(value || '');

  // 외부 props(value) 변경 시 내부 상태 동기화 (빈 값으로 리셋되는 경우도 반영)
  useEffect(() => {
    setSelectedDate(value || '');
  }, [value]);

  // 달력 표시 기준 Date 객체
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  });

  // 연도 변경 (-1년 / +1년)
  const changeYear = (amount: number) => {
    const nextDate = new Date(currentDate);
    nextDate.setFullYear(nextDate.getFullYear() + amount);
    setCurrentDate(nextDate);
  };

  // 월 변경 (-1달 / +1달)
  const changeMonth = (amount: number) => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + amount);
    setCurrentDate(nextDate);
  };

  const formattedDateString = formatDate(currentDate);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // 날짜 클릭 이벤트
  const handleDayPress = (day: { dateString: string }) => {
    const newDateStr = day.dateString;
    setSelectedDate(newDateStr);
    if (onChange) {
      onChange(newDateStr);
    }
  };

  return (
    <View className="overflow-hidden rounded-card border border-border bg-surface">
      {/* 상단 고정 커스텀 헤더 (년도 및 월 조작) */}
      <View className="flex-row items-center justify-between border-b border-border-divider bg-surface px-3 py-2.5">
        {/* 이전 연도 / 이전 월 버튼 */}
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => changeYear(-1)} className="px-1.5 py-0.5">
            <Text className="font-pretendard-bold text-xl text-primary">«</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeMonth(-1)} className="px-1.5 py-0.5">
            <Text className="font-pretendard-bold text-2xl text-text-muted">‹</Text>
          </TouchableOpacity>
        </View>

        {/* 현재 년도 및 월 표시 */}
        <Text className="font-pretendard-bold text-lg text-text-body">{`${currentYear}년 ${currentMonth}월`}</Text>

        {/* 다음 월 / 다음 연도 버튼 */}
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => changeMonth(1)} className="px-1.5 py-0.5">
            <Text className="font-pretendard-bold text-2xl text-text-muted">›</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeYear(1)} className="px-1.5 py-0.5">
            <Text className="font-pretendard-bold text-xl text-primary">»</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 고정 달력 */}
      <Calendar
        key={formattedDateString}
        current={formattedDateString}
        markedDates={
          selectedDate
            ? {
                [selectedDate]: {
                  selected: true,
                  selectedColor: colors.primary,
                  selectedTextColor: colors.surface,
                },
              }
            : {}
        }
        hideArrows={true}
        renderHeader={() => null}
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: colors.primary,
          textSectionTitleColor: colors.textBody,
          dayTextColor: colors.textBody,
          textDisabledColor: colors.textCalendarMuted,
        }}
      />
    </View>
  );
}