import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { WheelPicker } from './WheelPicker';
import { useMedicationForm } from '../hooks/useMedicationForm';
import { styles } from '../styles/medicationModal.styles';
import { MedicationModalProps } from '../types/medication';

const ClockIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke="#888888" strokeWidth="1.8" />
    <Path d="M12 7V12L15 14" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDownIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9L12 15L18 9" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MicIcon = ({ color = '#FF8C00' }) => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2Z" fill={color} stroke={color} strokeWidth="1" />
    <Path d="M19 10V11C19 14.87 15.87 18 12 18C8.13 18 5 14.87 5 11V10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M12 18V22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const PlayIcon = ({ color = '#FF8C00' }) => (
  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
    <Path d="M5 3L19 12L5 21V3Z" fill={color} stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </Svg>
);

const CloseIcon = ({ color = '#FF8C00' }) => (
  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const MedicationRegistrationModal = ({ visible, onClose }: MedicationModalProps) => {
  const {
    selectedMeals,
    toggleMeal,
    selectedDays,
    toggleDay,
    selectedPreset,
    handlePreset,
    daysList,
    timeState,
    updateTimeField,
    showTimePicker,
    setShowTimePicker,
    hasTimeSelected,
    setHasTimeSelected,
    remindOptions,
    selectedRemind,
    setSelectedRemind,
    showRemindPicker,
    setShowRemindPicker,
    hours,
    minutes,
    seconds,
    amPms,
    soundType,
    setSoundType,
    isRecording,
    handleRecord,
    handlePlay,
    handleDelete,
  } = useMedicationForm();

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>복약 등록</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            
            {/* 1. 약 이름 카드 */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>약 이름</Text>
              <View style={styles.quickBtnRow}>
                {['아침', '점심', '저녁'].map((meal) => {
                  const isSelected = selectedMeals.includes(meal);
                  return (
                    <TouchableOpacity
                      key={meal}
                      style={[styles.quickBtn, isSelected && styles.quickBtnActive]}
                      onPress={() => toggleMeal(meal)}
                    >
                      <Text style={[styles.quickBtnText, isSelected && styles.quickBtnTextActive]}>
                        {meal}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 2. 요일 선택 카드 */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>요일 선택</Text>
              <View style={styles.dayCircleRow}>
                {daysList.map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      style={[styles.dayCircle, { borderColor: isSelected ? '#FF8C00' : '#CCCCCC' }]}
                      onPress={() => toggleDay(day)}
                    >
                      <Text style={[styles.dayCircleText, { color: isSelected ? '#FF8C00' : '#888888' }]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* 매일 / 주간 / 주말 프리셋 버튼 (선택 시 주황색 적용) */}
              <View style={styles.presetRow}>
                <TouchableOpacity
                  style={[
                    styles.presetBtn,
                    selectedPreset === 'daily' && { backgroundColor: '#FF8C00' },
                  ]}
                  onPress={() => handlePreset('daily')}
                >
                  <Text style={styles.presetBtnText}>매일</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.presetBtn,
                    selectedPreset === 'weekday' && { backgroundColor: '#FF8C00' },
                  ]}
                  onPress={() => handlePreset('weekday')}
                >
                  <Text style={styles.presetBtnText}>주간</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.presetBtn,
                    selectedPreset === 'weekend' && { backgroundColor: '#FF8C00' },
                  ]}
                  onPress={() => handlePreset('weekend')}
                >
                  <Text style={styles.presetBtnText}>주말</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. 시간 선택 카드 */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>시간 선택</Text>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>복용 시간</Text>
              
              <TouchableOpacity
                style={styles.timePickerBox}
                onPress={() => {
                  setShowTimePicker(!showTimePicker);
                  setHasTimeSelected(true);
                }}
              >
                <Text style={styles.timePickerText}>
                  {hasTimeSelected
                    ? `${timeState.hour} : ${timeState.minute} : ${timeState.second}  ${timeState.amPm}`
                    : '복용 시간을 선택하세요'}
                </Text>
                <ClockIcon />
              </TouchableOpacity>

              {/* 복용 시간 무한 휠 피커 */}
              {showTimePicker && (
                <View style={styles.wheelPickerContainer}>
                  <View style={styles.pickerFocusLineTop} />
                  <View style={styles.pickerFocusLineBottom} />

                  <View style={styles.wheelPickerRow}>
                    <WheelPicker data={hours} selectedValue={timeState.hour} onSelect={(val) => updateTimeField('hour', val)} />
                    <Text style={styles.colonText}>:</Text>
                    <WheelPicker data={minutes} selectedValue={timeState.minute} onSelect={(val) => updateTimeField('minute', val)} />
                    <Text style={styles.colonText}>:</Text>
                    <WheelPicker data={seconds} selectedValue={timeState.second} onSelect={(val) => updateTimeField('second', val)} />
                    <WheelPicker data={amPms} selectedValue={timeState.amPm} onSelect={(val) => updateTimeField('amPm', val)} />
                  </View>
                </View>
              )}

              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#333', marginTop: 16, marginBottom: 8 }}>
                미복용 시 재알림 기간
              </Text>
              
              <TouchableOpacity 
                style={styles.selectBox} 
                onPress={() => setShowRemindPicker(!showRemindPicker)}
              >
                <Text style={styles.selectBoxText}>{selectedRemind}</Text>
                <ChevronDownIcon />
              </TouchableOpacity>

              {/* 재알림 피커 */}
              {showRemindPicker && (
                <View style={styles.wheelPickerContainer}>
                  <View style={styles.pickerFocusLineTop} />
                  <View style={styles.pickerFocusLineBottom} />

                  <View style={styles.wheelPickerRow}>
                    <WheelPicker
                      data={remindOptions}
                      selectedValue={selectedRemind}
                      onSelect={(val) => setSelectedRemind(val)}
                    />
                  </View>
                </View>
              )}
            </View>

            {/* 4. 음성 알림 설정 카드 */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>음성 알림 설정</Text>

              <TouchableOpacity style={[styles.radioRow, { marginBottom: 12 }]} onPress={() => setSoundType('tts')}>
                <View style={[styles.radioOuter, { borderColor: soundType === 'tts' ? '#FF8C00' : '#CCCCCC' }]}>
                  {soundType === 'tts' && <View style={styles.radioInner} />}
                </View>
                <Text style={{ fontSize: 14, color: '#333' }}>기본 알림음 (TTS)</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.radioRow} onPress={() => setSoundType('voice')}>
                <View style={[styles.radioOuter, { borderColor: soundType === 'voice' ? '#FF8C00' : '#CCCCCC' }]}>
                  {soundType === 'voice' && <View style={styles.radioInner} />}
                </View>
                <Text style={{ fontSize: 14, color: '#333' }}>보호자 음성 녹음</Text>
              </TouchableOpacity>

              {soundType === 'voice' && (
                <View style={styles.actionButtonGroup}>
                  <TouchableOpacity style={[styles.actionBtn, { borderColor: isRecording ? '#FF4D4F' : '#FF8C00' }]} onPress={handleRecord}>
                    <MicIcon color={isRecording ? '#FF4D4F' : '#FF8C00'} />
                    <Text style={[styles.actionBtnText, { color: isRecording ? '#FF4D4F' : '#FF8C00' }]}>
                      {isRecording ? '정지' : '녹음'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn} onPress={handlePlay}>
                    <PlayIcon color="#FF8C00" />
                    <Text style={styles.actionBtnText}>재생</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn} onPress={handleDelete}>
                    <CloseIcon color="#FF8C00" />
                    <Text style={styles.actionBtnText}>삭제</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* 저장 버튼 */}
            <TouchableOpacity style={styles.saveBtn} onPress={onClose}>
              <Text style={styles.saveBtnText}>저장하기</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};