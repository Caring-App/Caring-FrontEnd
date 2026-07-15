import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
// @ts-ignore
import { Calendar } from 'react-native-calendars';
import { styles } from '../../styles/ScheduleStyles';
import { TimePickerSection } from './TimePickerSection';
import { VoiceSettingsSection } from './VoiceSettingsSection';

export default function ScheduleModal() {
  const [userName, setUserName] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventHour, setEventHour] = useState('06');
  const [eventMinute, setEventMinute] = useState('28');
  const [eventSecond, setEventSecond] = useState('55');
  const [eventAmPm, setEventAmPm] = useState('PM');
  const [voiceOption, setVoiceOption] = useState('tts');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>사용자 이름</Text>
      <TextInput 
        style={styles.input} 
        placeholder="이름을 입력하세요" 
        value={userName}
        onChangeText={setUserName}
      />

      <Text style={styles.textTitle}>{userName || '사용자'}님 일정 등록</Text>
      
      <Text style={styles.label}>일정 이름</Text>
      <TextInput 
        style={styles.input} 
        placeholder="일정 이름을 입력하세요" 
        value={eventName}
        onChangeText={setEventName}
      />
      
      <Calendar />

      <TimePickerSection 
        label="일정 시간" 
        hour={eventHour} 
        minute={eventMinute} 
        second={eventSecond} 
        amPm={eventAmPm} 
        onHourChange={setEventHour} 
        onMinuteChange={setEventMinute} 
        onSecondChange={setEventSecond} 
        onAmPmChange={setEventAmPm} 
      />

      <VoiceSettingsSection 
        voiceOption={voiceOption} 
        setVoiceOption={setVoiceOption} 
      />

      <TouchableOpacity style={styles.btnSave}>
        <Text style={styles.btnSaveText}>저장하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}