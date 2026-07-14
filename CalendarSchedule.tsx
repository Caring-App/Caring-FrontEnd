import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';

// @ts-ignore
import { Calendar } from 'react-native-calendars';

// @ts-ignore
import { WheelPicker } from 'react-native-wheel-pick';

export default function ScheduleModal() {
  
  const [eventName, setEventName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('장소 1');
  const [voiceOption, setVoiceOption] = useState('tts'); // 'tts' 또는 'recording'
  const [selectedDate, setSelectedDate] = useState('2026-04-21');

  // --- 일정 시간 선택 상태 ---
  const [eventHour, setEventHour] = useState('06');
  const [eventMinute, setEventMinute] = useState('28');
  const [eventSecond, setEventSecond] = useState('55');
  const [eventAmPm, setEventAmPm] = useState('PM');

  // --- 음성 알림 시간 선택 상태 ---
  const [alarmHour, setAlarmHour] = useState('06');
  const [alarmMinute, setAlarmMinute] = useState('28');
  const [alarmSecond, setAlarmSecond] = useState('55');
  const [alarmAmPm, setAlarmAmPm] = useState('PM');

  // 스크롤 데이터 배열 생성
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutesSeconds = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const amPmOptions = ['PM', 'AM'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      
      {/* 1. 상단 헤더 타이틀 */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={styles.iconCalendar} />
          <Text style={styles.textTitle}>이나연님 일정 등록</Text>
        </View>
        <TouchableOpacity style={styles.btnClose}>
          <Text style={styles.textClose}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* 2. 일정 이름 입력 필드 */}
      <Text style={styles.label}>일정 이름</Text>
      <TextInput
        style={styles.input}
        placeholder="일정 이름을 입력하세요"
        placeholderTextColor="#999999"
        value={eventName}
        onChangeText={setEventName}
      />

      {/* 3. 장소 드롭다운 스타일 */}
      <Text style={styles.label}>장소</Text>
      <View style={styles.dropdownFake}>
        <Text style={{ color: '#333' }}>장소를 선택하세요</Text>
        <Text style={{ color: '#999' }}>▼</Text>
      </View>
      
      {/* 장소 예시 리스트 박스 */}
      <View style={styles.locationList}>
        {['장소 1', '장소 2', '장소 3'].map((loc) => (
          <TouchableOpacity key={loc} onPress={() => setSelectedLocation(loc)} style={styles.locationItem}>
            <Text style={{ 
              color: selectedLocation === loc ? '#FF7A00' : '#666', 
              fontWeight: selectedLocation === loc ? 'bold' : 'normal' 
            }}>{loc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      {/* 4. 달력 컴포넌트 */}
      <Calendar
        current={'2026-04-21'}
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#007AFF' },
          '2026-04-30': { selected: true, selectedColor: '#007AFF' }
        }}
        theme={{
          todayTextColor: '#FF7A00',
          arrowColor: '#999999',
          selectedDayTextColor: '#ffffff',
        }}
      />

      <View style={styles.divider} />

      {/* 5. 일정 시간 */}
      <Text style={styles.label}>일정 시간</Text>
      <View style={styles.infoInputBox}>
        <Text style={styles.infoInputText}>일정 시간을 선택하세요</Text>
        <Text style={{ fontSize: 16 }}>🕒</Text>
      </View>

      <View style={styles.pickerCard}>
        <WheelPicker style={styles.wheel} isCyclic data={hours} selectedItem={eventHour} onItemSelected={(item: string) => setEventHour(item)} />
        <Text style={styles.colon}>:</Text>
        <WheelPicker style={styles.wheel} isCyclic data={minutesSeconds} selectedItem={eventMinute} onItemSelected={(item: string) => setEventMinute(item)} />
        <Text style={styles.colon}>:</Text>
        <WheelPicker style={styles.wheel} isCyclic data={minutesSeconds} selectedItem={eventSecond} onItemSelected={(item: string) => setEventSecond(item)} />
        <View style={{ width: 10 }} />
        <WheelPicker style={[styles.wheel, { flex: 1.3 }]} data={amPmOptions} selectedItem={eventAmPm} onItemSelected={(item: string) => setEventAmPm(item)} />
      </View>


      {/* 6. 음성 알림 시간 */}
      <Text style={styles.label}>음성 알림 시간</Text>
      <View style={styles.infoInputBox}>
        <Text style={styles.infoInputText}>알림을 전달 할 시간을 선택하세요</Text>
        <Text style={{ fontSize: 16 }}>🕒</Text>
      </View>

      <View style={styles.pickerCard}>
        <WheelPicker style={styles.wheel} isCyclic data={hours} selectedItem={alarmHour} onItemSelected={(item: string) => setAlarmHour(item)} />
        <Text style={styles.colon}>:</Text>
        <WheelPicker style={styles.wheel} isCyclic data={minutesSeconds} selectedItem={alarmMinute} onItemSelected={(item: string) => setAlarmMinute(item)} />
        <Text style={styles.colon}>:</Text>
        <WheelPicker style={styles.wheel} isCyclic data={minutesSeconds} selectedItem={alarmSecond} onItemSelected={(item: string) => setAlarmSecond(item)} />
        <View style={{ width: 10 }} />
        <WheelPicker style={[styles.wheel, { flex: 1.3 }]} data={amPmOptions} selectedItem={alarmAmPm} onItemSelected={(item: string) => setAlarmAmPm(item)} />
      </View>


      {/* 7. 음성 알림 설정 컴포넌트 */}
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

        {/* 녹음 제어 서브 버튼 배치 */}
        <View style={styles.voiceButtonContainer}>
          <TouchableOpacity style={styles.voiceBtn}><Text style={styles.voiceBtnText}>🎙 녹음</Text></TouchableOpacity>
          <TouchableOpacity style={styles.voiceBtn}><Text style={styles.voiceBtnText}>▶ 재생</Text></TouchableOpacity>
          <TouchableOpacity style={styles.voiceBtn}><Text style={styles.voiceBtnText}>✕ 삭제</Text></TouchableOpacity>
        </View>
      </View>

      {/* 8. 최종 저장 버튼 */}
      <TouchableOpacity style={styles.btnSave}>
        <Text style={styles.btnSaveText}>저장하기</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 25 },
  titleGroup: { flexDirection: 'row', alignItems: 'center' },
  iconCalendar: { width: 16, height: 16, backgroundColor: '#FF7A00', borderRadius: 3, marginRight: 8 },
  textTitle: { color: '#333333', fontSize: 19, fontWeight: 'bold' },
  btnClose: { padding: 5 },
  textClose: { color: '#999999', fontSize: 20 },
  label: { color: '#333333', fontSize: 15, fontWeight: 'bold', marginBottom: 8, marginTop: 12 },
  input: { height: 48, borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 6, paddingHorizontal: 12, fontSize: 14, color: '#333', marginBottom: 20 },
  dropdownFake: { height: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 6, paddingHorizontal: 12, marginBottom: 4 },
  locationList: { backgroundColor: '#F9F9F9', padding: 6, borderRadius: 6, marginBottom: 20 },
  locationItem: { padding: 8 },
  divider: { height: 1, backgroundColor: '#EAEAEA', marginVertical: 20 },
  infoInputBox: { height: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 6, paddingHorizontal: 12, marginBottom: 12 },
  infoInputText: { color: '#999999', fontSize: 14 },
  
  pickerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 150,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  wheel: { flex: 1, height: 130, backgroundColor: 'transparent' },
  colon: { fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center', width: 10 },
  
  voiceSettingContainer: { borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 16, padding: 16, marginBottom: 25 },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#EAEAEA', marginRight: 10 },
  radioChecked: { borderColor: '#FF7A00', backgroundColor: '#FF7A00' },
  radioText: { fontSize: 14, color: '#333', fontWeight: '500' },
  
  voiceButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  voiceBtn: { flex: 1, height: 40, borderWidth: 1, borderColor: '#FF7A00', borderRadius: 8, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginHorizontal: 4 },
  voiceBtnText: { color: '#FF7A00', fontSize: 13, fontWeight: 'bold' },
  
  btnSave: { height: 54, backgroundColor: '#FF7A00', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 5 },
  btnSaveText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
