import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

// @ts-ignore
import { WheelPicker } from 'react-native-wheel-pick';

export default function MedicationSchedule() {
  // --- 상태 관리 (State) ---
  const [userName, setUserName] = useState(''); // 이름 입력 상태
  const [selectedMeal, setSelectedMeal] = useState('아침'); 
  const [selectedDays, setSelectedDays] = useState<string[]>(['월', '화', '수', '목', '금']); 
  const [voiceOption, setVoiceOption] = useState('tts'); 
  const [reAlarmPeriod, setReAlarmPeriod] = useState('10분 후');

  // --- 복용 시간 선택 상태 ---
  const [takeHour, setTakeHour] = useState('06');
  const [takeMinute, setTakeMinute] = useState('28');
  const [takeSecond, setTakeSecond] = useState('55');
  const [takeAmPm, setTakeAmPm] = useState('PM');

  const mealOptions = ['아침', '점심', '저녁'];
  const dayOptions = ['월', '화', '수', '목', '금', '토', '일'];
  const quickDayOptions = ['매일', '주간', '주말'];
  
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutesSeconds = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const amPmOptions = ['PM', 'AM'];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleQuickDaySelect = (option: string) => {
    if (option === '매일') setSelectedDays(['월', '화', '수', '목', '금', '토', '일']);
    if (option === '주간') setSelectedDays(['월', '화', '수', '목', '금']);
    if (option === '주말') setSelectedDays(['토', '일']);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      
      {/* 타이틀 구역 */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.iconPill}>💊</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="사용자"
            placeholderTextColor="#999"
            value={userName}
            onChangeText={setUserName}
          />
          <Text style={styles.textTitle}>님 복약 등록</Text>
        </View>
        <TouchableOpacity style={styles.btnClose}>
          <Text style={styles.textClose}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* 1. 약 이름 카드 */}
      <View style={styles.cardBox}>
        <Text style={styles.label}>약 이름</Text>
        <View style={styles.mealButtonGroup}>
          {mealOptions.map((meal) => (
            <TouchableOpacity
              key={meal}
              style={[styles.mealBtn, selectedMeal === meal && styles.mealBtnActive]}
              onPress={() => setSelectedMeal(meal)}
            >
              <Text style={[styles.mealBtnText, selectedMeal === meal && styles.mealBtnTextActive]}>
                {meal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 2. 요일 선택 카드 */}
      <View style={styles.cardBox}>
        <Text style={styles.label}>요일 선택</Text>
        <View style={styles.dayCircleGroup}>
          {dayOptions.map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayCircle, isSelected && styles.dayCircleActive]}
                onPress={() => toggleDay(day)}
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
            <TouchableOpacity
              key={option}
              style={styles.quickDayBtn}
              onPress={() => handleQuickDaySelect(option)}
            >
              <Text style={styles.quickDayBtnText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 3. 시간 선택 카드 */}
      <View style={styles.cardBox}>
        <Text style={styles.label}>시간 선택</Text>
        <Text style={styles.subLabel}>복용 시간</Text>
        <View style={styles.infoInputBox}>
          <Text style={styles.infoInputText}>복용 시간을 선택하세요</Text>
          <Text style={{ fontSize: 16 }}>🕒</Text>
        </View>

        <View style={styles.pickerCard}>
          <WheelPicker style={styles.wheel} isCyclic data={hours} selectedItem={takeHour} onItemSelected={(item: string) => setTakeHour(item)} />
          <Text style={styles.colon}>:</Text>
          <WheelPicker style={styles.wheel} isCyclic data={minutesSeconds} selectedItem={takeMinute} onItemSelected={(item: string) => setTakeMinute(item)} />
          <Text style={styles.colon}>:</Text>
          <WheelPicker style={styles.wheel} isCyclic data={minutesSeconds} selectedItem={takeSecond} onItemSelected={(item: string) => setTakeSecond(item)} />
          <View style={{ width: 10 }} />
          <WheelPicker style={[styles.wheel, { flex: 1.3 }]} data={amPmOptions} selectedItem={takeAmPm} onItemSelected={(item: string) => setTakeAmPm(item)} />
        </View>

        <Text style={styles.subLabel}>미복용 시 재알림 기간</Text>
        <View style={styles.dropdownFake}>
          <Text style={{ color: '#333' }}>{reAlarmPeriod}</Text>
          <Text style={{ color: '#999' }}>▼</Text>
        </View>
      </View>

      {/* 4. 음성 알림 설정 */}
      <View style={styles.voiceSettingContainer}>
        <Text style={styles.label}>음성 알림 설정</Text>
        <TouchableOpacity style={styles.radioOption} onPress={() => setVoiceOption('tts')}>
          <View style={[styles.radioCircle, voiceOption === 'tts' && styles.radioChecked]} />
          <Text style={styles.radioText}>기본 알림음 (TTS)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.radioOption} onPress={() => setVoiceOption('recording')}>
          <View style={[styles.radioCircle, voiceOption === 'recording' && styles.radioChecked]} />
          <Text style={styles.radioText}>보호자 음성 녹음</Text>
        </TouchableOpacity>
      </View>

      {/* 5. 저장 버튼 */}
      <TouchableOpacity style={styles.btnSave}>
        <Text style={styles.btnSaveText}>저장하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 20 },
  titleGroup: { flexDirection: 'row', alignItems: 'center' },
  iconPill: { fontSize: 18, marginRight: 6 },
  textTitle: { color: '#333333', fontSize: 19, fontWeight: 'bold' },
  nameInput: { fontSize: 19, fontWeight: 'bold', color: '#333', borderBottomWidth: 1, borderBottomColor: '#EAEAEA', minWidth: 60, paddingVertical: 0, marginRight: 4 },
  btnClose: { padding: 5 },
  textClose: { color: '#999999', fontSize: 20 },
  cardBox: { borderWidth: 1, borderColor: '#F2F2F2', borderRadius: 12, padding: 16, marginBottom: 20, backgroundColor: '#FFFFFF' },
  label: { color: '#333333', fontSize: 15, fontWeight: 'bold', marginBottom: 12 },
  subLabel: { color: '#333333', fontSize: 13, fontWeight: 'bold', marginTop: 10, marginBottom: 8 },
  mealButtonGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  mealBtn: { flex: 1, height: 44, borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginHorizontal: 4 },
  mealBtnActive: { borderColor: '#FF7A00', borderWidth: 1.5 },
  mealBtnText: { color: '#666666', fontSize: 14, fontWeight: '500' },
  mealBtnTextActive: { color: '#FF7A00', fontWeight: 'bold' },
  dayCircleGroup: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  dayCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#EAEAEA', alignItems: 'center', justifyContent: 'center' },
  dayCircleActive: { borderColor: '#FF7A00', borderWidth: 1.5 },
  dayCircleText: { color: '#666666', fontSize: 13 },
  dayCircleTextActive: { color: '#FF7A00', fontWeight: 'bold' },
  quickDayGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  quickDayBtn: { flex: 1, height: 34, backgroundColor: '#FF7A00', borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginHorizontal: 4 },
  quickDayBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  infoInputBox: { height: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 6, paddingHorizontal: 12, marginBottom: 12 },
  infoInputText: { color: '#999999', fontSize: 13 },
  dropdownFake: { height: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 6, paddingHorizontal: 12 },
  pickerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 16, paddingHorizontal: 15, height: 140, marginBottom: 15 },
  wheel: { flex: 1, height: 120, backgroundColor: 'transparent' },
  colon: { fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center', width: 10 },
  voiceSettingContainer: { borderWidth: 1, borderColor: '#F2F2F2', borderRadius: 12, padding: 16, marginBottom: 25 },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#EAEAEA', marginRight: 10 },
  radioChecked: { borderColor: '#FF7A00', backgroundColor: '#FF7A00' },
  radioText: { fontSize: 14, color: '#333', fontWeight: '500' },
  btnSave: { height: 54, backgroundColor: '#FF7A00', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnSaveText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});