import React from 'react';
import { View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// 한글 설정
LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

interface CalendarProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
}

export const CalendarComponent = ({ currentDate, onDateSelect }: CalendarProps) => {
  const dateString = currentDate.toISOString().split('T')[0];

  return (
    <View>
      <Calendar
        markedDates={{
          [dateString]: { selected: true }
        }}
        onDayPress={(day) => onDateSelect(new Date(day.dateString))}
      />
    </View>
  );
};