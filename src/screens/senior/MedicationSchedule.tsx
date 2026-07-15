import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/MedicationStyles';
import { MealSelector } from '../../features/schedule/ui/MealSelector';
import { DaySelector } from '../../features/schedule/ui/DaySelector';
import { TimePickerSection } from '../../features/schedule/ui/TimePickerSection';

export default function MedicationSchedule() {
  const [userName, setUserName] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('아침');
  const [selectedDays, setSelectedDays] = useState(['월', '화', '수', '목', '금']);
  const [takeHour, setTakeHour] = useState('06');
  const [takeMinute, setTakeMinute] = useState('28');
  const [takeSecond, setTakeSecond] = useState('55');
  const [takeAmPm, setTakeAmPm] = useState('PM');

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutesSeconds = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TextInput style={styles.nameInput} value={userName} onChangeText={setUserName} placeholder="사용자" />
        <Text style={styles.textTitle}>님 복약 등록</Text>
      </View>

      <View style={styles.cardBox}>
        <Text style={styles.label}>약 이름</Text>
        <MealSelector selectedMeal={selectedMeal} onSelect={setSelectedMeal} />
      </View>

      <DaySelector 
        selectedDays={selectedDays} 
        onToggleDay={(day) => setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
        onQuickSelect={(opt) => {
          if (opt === '매일') setSelectedDays(['월', '화', '수', '목', '금', '토', '일']);
          if (opt === '주간') setSelectedDays(['월', '화', '수', '목', '금']);
          if (opt === '주말') setSelectedDays(['토', '일']);
        }}
      />

      <TimePickerSection 
        hours={hours} minutesSeconds={minutesSeconds} 
        takeHour={takeHour} setTakeHour={setTakeHour}
        takeMinute={takeMinute} setTakeMinute={setTakeMinute}
        takeSecond={takeSecond} setTakeSecond={setTakeSecond}
        takeAmPm={takeAmPm} setTakeAmPm={setTakeAmPm}
      />

      <TouchableOpacity style={styles.btnSave}><Text style={styles.btnSaveText}>저장하기</Text></TouchableOpacity>
    </ScrollView>
  );
}