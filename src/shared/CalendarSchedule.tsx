import React, { useState } from 'react';
import { ScrollView, Text, TextInput } from 'react-native';


import { styles } from '../styles/ScheduleStyles'; 
import { TimePickerSection } from '../features/schedule/ui/TimePickerSection';
import { VoiceSettingsSection } from '../features/schedule/ui/VoiceSettingsSection';
import { MealSelector } from '../features/schedule/ui/MealSelector';
export default function ScheduleModal() {
  const [userName, setUserName] = useState('');
  const [eventName, setEventName] = useState('');
  
  // 1. 선택된 식사를 관리할 state 추가
  const [selectedMeal, setSelectedMeal] = useState('아침'); 

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>사용자 이름</Text>
      <TextInput
        style={styles.input}
        placeholder="이름을 입력하세요"
        value={userName}
        onChangeText={setUserName}
      />

      {/* 2. MealSelector 컴포넌트 연결 */}
      <Text style={styles.label}>약 이름</Text>
      <MealSelector 
        selectedMeal={selectedMeal} 
        onSelect={(meal) => setSelectedMeal(meal)} 
      />

      <Text style={styles.textTitle}>{userName || '사용자'}님 일정 등록</Text>
      
      <Text style={styles.label}>일정 이름</Text>
      <TextInput
        style={styles.input}
        placeholder="일정 이름을 입력하세요"
        value={eventName}
        onChangeText={setEventName}
      />

      <TimePickerSection />
      <VoiceSettingsSection />
    </ScrollView>
  );
}