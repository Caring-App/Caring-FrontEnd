import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/MedicationStyles';

interface Props {
  selectedDays: string[];
  onToggleDay: (day: string) => void;
  onQuickSelect: (option: string) => void;
}

export const DaySelector = ({ selectedDays, onToggleDay, onQuickSelect }: Props) => {
  const dayOptions = ['월', '화', '수', '목', '금', '토', '일'];
  const quickDayOptions = ['매일', '주간', '주말'];

  return (
    <View style={styles.cardBox}>
      <Text style={styles.label}>요일 선택</Text>
      <View style={styles.dayCircleGroup}>
        {dayOptions.map((day) => {
          const isSelected = selectedDays.includes(day);
          return (
            <TouchableOpacity
              key={day}
              style={[styles.dayCircle, isSelected && styles.dayCircleActive]}
              onPress={() => onToggleDay(day)}
            >
              <Text style={[styles.dayCircleText, isSelected && styles.dayCircleTextActive]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.quickDayGroup}>
        {quickDayOptions.map((option) => (
          <TouchableOpacity key={option} style={styles.quickDayBtn} onPress={() => onQuickSelect(option)}>
            <Text style={styles.quickDayBtnText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};