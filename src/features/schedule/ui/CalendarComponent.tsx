import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
  currentDate?: Date | null;
  onDateSelect: (date: Date) => void;
}

export const CalendarComponent = ({ currentDate, onDateSelect }: CalendarProps) => {
  const targetDate = currentDate instanceof Date && !isNaN(currentDate.getTime()) 
    ? currentDate 
    : new Date();

  const [activeDate, setActiveDate] = useState(targetDate);

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth() + 1;
  const monthString = String(month).padStart(2, '0');
  const dayString = String(activeDate.getDate()).padStart(2, '0');
  const dateString = `${year}-${monthString}-${dayString}`;

  const changeMonth = (offset: number) => {
    const newDate = new Date(activeDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setActiveDate(newDate);
  };

  const changeYear = (offset: number) => {
    const newDate = new Date(activeDate);
    newDate.setFullYear(newDate.getFullYear() + offset);
    setActiveDate(newDate);
  };

  return (
    <View style={styles.container}>
      {/* 상단 커스텀 화살표 및 월/년도 영역 */}
      <View style={styles.headerContainer}>
        <View style={styles.arrowGroup}>
          <TouchableOpacity onPress={() => changeYear(-1)} style={styles.arrowBtn}>
            <Text style={styles.arrowText}>«</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowBtn}>
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>{`${month}월  ${year}`}</Text>

        <View style={styles.arrowGroup}>
          <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowBtn}>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeYear(1)} style={styles.arrowBtn}>
            <Text style={styles.arrowText}>»</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Calendar
        hideArrows={true}
        renderHeader={() => null} 
        current={dateString}
        key={dateString} 
        markedDates={{
          [dateString]: { 
            selected: true, 
            selectedColor: '#E67200' // tailwind primary[600]
          }
        }}
        onDayPress={(day) => {
          const selected = new Date(day.timestamp);
          setActiveDate(selected);
          onDateSelect(selected);
        }}
        theme={{
          todayTextColor: '#E67200',        // tailwind primary[600]
          calendarBackground: 'transparent',
          textSectionTitleColor: '#656c6c', // tailwind text.muted
          dayTextColor: '#2a2a2a',          // tailwind text.strong
          textDisabledColor: '#e2e5e5',     // tailwind border.DEFAULT (연한 비활성 색상용)
          selectedDayBackgroundColor: '#E67200', // tailwind primary[600]
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff', // tailwind surface.DEFAULT
    borderRadius: 12,
    paddingVertical: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  arrowGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  arrowText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#656c6c', // tailwind text.muted
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2a2a2a', // tailwind text.strong
  },
});