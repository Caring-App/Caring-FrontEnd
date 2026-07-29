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
  currentDate?: Date | null; // null/undefined 허용으로 안전하게 변경
  onDateSelect: (date: Date) => void;
}

export const CalendarComponent = ({ currentDate, onDateSelect }: CalendarProps) => {
  // currentDate가 없으면 오늘 날짜를 기본값으로 사용 (Crash 방지!)
  const targetDate = currentDate instanceof Date && !isNaN(currentDate.getTime()) 
    ? currentDate 
    : new Date();

  // yyyy-mm-dd 포맷 안전하게 추출 (toISOString 시차 문제 완화)
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  return (
    <View>
      <Calendar
        current={dateString}
        markedDates={{
          [dateString]: { 
            selected: true, 
            selectedColor: '#E67200' // 원하는 포인트 색상 지정 가능
          }
        }}
        onDayPress={(day) => {
          // day.dateString 은 "YYYY-MM-DD" 형태의 문자열입니다.
          onDateSelect(new Date(day.timestamp));
        }}
        theme={{
          todayTextColor: '#E67200',
          arrowColor: '#E67200',
        }}
      />
    </View>
  );
};