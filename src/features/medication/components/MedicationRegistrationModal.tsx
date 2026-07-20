import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { MedicationRegistrationModalProps } from '../types/medication';
import { useMedicationForm } from '../hooks/useMedicationForm';
import { WheelPicker } from './WheelPicker';
import { styles } from '../styles/medicationModal.styles';

export const MedicationRegistrationModal = ({ visible, onClose, onSave }: MedicationRegistrationModalProps) => {
  const {
    medicationName,
    setMedicationName,
    timeCategory,
    setTimeCategory,
    selectedDays,
    setSelectedDays,
    toggleDay,
    daysList,
    medTime,
    setMedTime,
    showTimePicker,
    setShowTimePicker,
    remindInterval,
    setRemindInterval,
    showRemindDropdown,
    setShowRemindDropdown,
    soundType,
    setSoundType,
    isRecording,
    hasRecorded,
    handleRecord,
    handlePlay,
    handleDelete,
    handleSave,
  } = useMedicationForm(onClose, onSave);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const seconds = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const amPms = ['AM', 'PM'];
  const remindOptions = ['5분 후', '10분 후', '15분 후', '30분 후', '1시간 후'];

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* 헤더 */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>복약 등록</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            
            {/* 1. 약 이름 & 아침/점심/저녁 분류 */}
            <View style={{ marginBottom: 15 }}>
              <Text style={styles.sectionTitle}>약 이름</Text>
              <TextInput
                style={styles.textInput}
                placeholder="약 이름을 입력하세요"
                placeholderTextColor="#999"
                value={medicationName}
                onChangeText={setMedicationName}
              />
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {(['아침', '점심', '저녁'] as const).map((item) => {
                  const isSelected = timeCategory === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={styles.mealButton(isSelected)}
                      onPress={() => setTimeCategory(item)}
                    >
                      <Text style={styles.mealButtonText(isSelected)}>{item}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 2. 요일 선택 */}
            <View style={styles.cardBox}>
              <Text style={[styles.sectionTitle, { color: '#333', marginBottom: 10 }]}>요일 선택</Text>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                {daysList.map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      style={styles.dayButton(isSelected)}
                      onPress={() => toggleDay(day)}
                    >
                      <Text style={styles.dayButtonText(isSelected)}>{day}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.quickDayButton} onPress={() => setSelectedDays([...daysList])}>
                  <Text style={styles.quickDayButtonText}>매일</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickDayButton} onPress={() => setSelectedDays(['월', '화', '수', '목', '금'])}>
                  <Text style={styles.quickDayButtonText}>주간</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickDayButton} onPress={() => setSelectedDays(['토', '일'])}>
                  <Text style={styles.quickDayButtonText}>주말</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. 복용 시간 */}
            <View style={{ marginBottom: 15 }}>
              <Text style={styles.sectionTitle}>복용 시간</Text>
              <TouchableOpacity 
                onPress={() => setShowTimePicker(!showTimePicker)}
                style={styles.selectBox}
              >
                <Text style={styles.selectBoxText}>
                  {`${medTime.hour} : ${medTime.minute} : ${medTime.second}  ${medTime.amPm}`}
                </Text>
                <Text style={{ color: '#999' }}>⏰</Text>
              </TouchableOpacity>

              {showTimePicker && (
                <View style={styles.pickerContainer}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <WheelPicker data={hours} selectedValue={medTime.hour} onSelect={(val) => setMedTime(prev => ({ ...prev, hour: val }))} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginHorizontal: 2 }}>:</Text>
                    <WheelPicker data={minutes} selectedValue={medTime.minute} onSelect={(val) => setMedTime(prev => ({ ...prev, minute: val }))} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginHorizontal: 2 }}>:</Text>
                    <WheelPicker data={seconds} selectedValue={medTime.second} onSelect={(val) => setMedTime(prev => ({ ...prev, second: val }))} />
                    <WheelPicker data={amPms} selectedValue={medTime.amPm} onSelect={(val) => setMedTime(prev => ({ ...prev, amPm: val as 'AM' | 'PM' }))} />
                  </View>
                </View>
              )}
            </View>

            {/* 4. 미복용 시 재알림 기간 */}
            <View style={{ marginBottom: 15, zIndex: 10 }}>
              <Text style={styles.sectionTitle}>미복용 시 재알림 기간</Text>
              <TouchableOpacity
                style={styles.selectBox}
                onPress={() => setShowRemindDropdown(!showRemindDropdown)}
              >
                <Text style={{ color: '#333' }}>{remindInterval}</Text>
                <Text style={{ color: '#999' }}>▼</Text>
              </TouchableOpacity>

              {showRemindDropdown && (
                <View style={styles.dropdownList}>
                  {remindOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setRemindInterval(opt);
                        setShowRemindDropdown(false);
                      }}
                    >
                      <Text style={{ color: '#333' }}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* 5. 음성 알림 설정 */}
            <View style={styles.cardBox}>
              <Text style={[styles.sectionTitle, { color: '#333', marginBottom: 12 }]}>음성 알림 설정</Text>

              <TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
                onPress={() => setSoundType('tts')}
              >
                <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: soundType === 'tts' ? '#FF8C00' : '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                  {soundType === 'tts' && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF8C00' }} />}
                </View>
                <Text style={{ fontSize: 14, color: '#333' }}>기본 알림용 (TTS)</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: soundType === 'voice' ? 12 : 0 }}
                onPress={() => setSoundType('voice')}
              >
                <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: soundType === 'voice' ? '#FF8C00' : '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                  {soundType === 'voice' && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF8C00' }} />}
                </View>
                <Text style={{ fontSize: 14, color: '#333' }}>보호자 음성 녹음</Text>
              </TouchableOpacity>

              {soundType === 'voice' && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingLeft: 26 }}>
                  <TouchableOpacity 
                    style={{ flex: 1, borderWidth: 1, borderColor: isRecording ? '#ff4d4f' : '#FF8C00', borderRadius: 8, paddingVertical: 8, alignItems: 'center', marginRight: 6, backgroundColor: isRecording ? '#fff1f0' : '#fff' }}
                    onPress={handleRecord}
                  >
                    <Text style={{ fontSize: 13, color: isRecording ? '#ff4d4f' : '#FF8C00', fontWeight: 'bold' }}>
                      {isRecording ? '⏹ 정지' : '🎙️ 녹음'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={{ flex: 1, borderWidth: 1, borderColor: '#fa8c16', borderRadius: 8, paddingVertical: 8, alignItems: 'center', marginHorizontal: 6, backgroundColor: '#fff' }}
                    onPress={handlePlay}
                  >
                    <Text style={{ fontSize: 13, color: '#fa8c16', fontWeight: 'bold' }}>▶ 재생</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={{ flex: 1, borderWidth: 1, borderColor: '#ff4d4f', borderRadius: 8, paddingVertical: 8, alignItems: 'center', marginLeft: 6, backgroundColor: '#fff' }}
                    onPress={handleDelete}
                  >
                    <Text style={{ fontSize: 13, color: '#ff4d4f', fontWeight: 'bold' }}>✕ 삭제</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

          </ScrollView>

          {/* 저장하기 버튼 */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>저장하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};