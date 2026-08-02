import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

// 1. 공통 캘린더 컴포넌트 Import
import { CalendarComponent } from '../../../features/schedule/ui/CalendarComponent';

// 2. 분리한 파일들 Import (UI / Component / Type / Style)
import { ClockIcon, MicIcon, PlayIcon, CloseIcon } from './components/ModalIcons';
import { WheelPicker } from './components/WheelPicker';
import { ScheduleModalProps } from './types/scheduleModal.types';
import { styles } from './styles/ScheduleRegistrationModal.styles';

// 3. 커스텀 훅 Import
import { useScheduleRegistration } from './hooks/useScheduleRegistration';

export const ScheduleRegistrationModal = ({ visible, onClose, onSave }: ScheduleModalProps) => {
  // 훅에서 모든 상태(state)와 핸들러(actions)를 가져옵니다.
  const { state, actions } = useScheduleRegistration(onClose, onSave);

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>일정 등록</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
            
            {/* 1) 일정 이름 */}
            <View style={styles.section}>
              <Text style={styles.label}>일정 이름</Text>
              <TextInput
                style={styles.input}
                placeholder="일정 이름을 입력하세요"
                placeholderTextColor="#999"
                value={state.title}
                onChangeText={actions.setTitle}
              />
            </View>

            {/* 2) 장소 */}
            <View style={styles.section}>
              <Text style={styles.label}>장소</Text>
              <TextInput
                style={styles.input}
                placeholder="장소를 입력하세요"
                placeholderTextColor="#999"
                value={state.location}
                onChangeText={actions.setLocation}
              />
            </View>

            {/* 3) 캘린더 */}
            <CalendarComponent 
              currentDate={state.selectedDate} 
              onDateSelect={(date: Date) => actions.setSelectedDate(date)} 
            />

            {/* 4) 일정 시간 */}
            <View style={styles.section}>
              <Text style={styles.label}>일정 시간</Text>
              <TouchableOpacity 
                onPress={() => actions.setShowSchedulePicker(!state.showSchedulePicker)}
                style={styles.timePickerBox}
              >
                <Text style={styles.timePickerText}>
                  {`${state.scheduleTime.hour} : ${state.scheduleTime.minute} : ${state.scheduleTime.second}  ${state.scheduleTime.amPm}`}
                </Text>
                <ClockIcon />
              </TouchableOpacity>

              {state.showSchedulePicker && (
                <View style={styles.wheelPickerContainer}>
                  <View style={styles.wheelPickerRow}>
                    <WheelPicker 
                      data={state.options.hours} 
                      selectedValue={state.scheduleTime.hour} 
                      onSelect={(val) => actions.setScheduleTime(prev => ({ ...prev, hour: val }))} 
                    />
                    <Text style={styles.colonText}>:</Text>
                    <WheelPicker 
                      data={state.options.minutes} 
                      selectedValue={state.scheduleTime.minute} 
                      onSelect={(val) => actions.setScheduleTime(prev => ({ ...prev, minute: val }))} 
                    />
                    <Text style={styles.colonText}>:</Text>
                    <WheelPicker 
                      data={state.options.seconds} 
                      selectedValue={state.scheduleTime.second} 
                      onSelect={(val) => actions.setScheduleTime(prev => ({ ...prev, second: val }))} 
                    />
                    <WheelPicker 
                      data={state.options.amPms} 
                      selectedValue={state.scheduleTime.amPm} 
                      onSelect={(val) => actions.setScheduleTime(prev => ({ ...prev, amPm: val as 'AM' | 'PM' }))} 
                    />
                  </View>
                </View>
              )}
            </View>

            {/* 5) 음성 알림 시간 */}
            <View style={styles.section}>
              <Text style={styles.label}>음성 알림 시간</Text>
              <TouchableOpacity 
                onPress={() => actions.setShowAlertPicker(!state.showAlertPicker)}
                style={styles.timePickerBox}
              >
                <Text style={styles.timePickerText}>
                  {`${state.alertTime.hour} : ${state.alertTime.minute} : ${state.alertTime.second}  ${state.alertTime.amPm}`}
                </Text>
                <ClockIcon />
              </TouchableOpacity>

              {state.showAlertPicker && (
                <View style={styles.wheelPickerContainer}>
                  <View style={styles.wheelPickerRow}>
                    <WheelPicker 
                      data={state.options.hours} 
                      selectedValue={state.alertTime.hour} 
                      onSelect={(val) => actions.setAlertTime(prev => ({ ...prev, hour: val }))} 
                    />
                    <Text style={styles.colonText}>:</Text>
                    <WheelPicker 
                      data={state.options.minutes} 
                      selectedValue={state.alertTime.minute} 
                      onSelect={(val) => actions.setAlertTime(prev => ({ ...prev, minute: val }))} 
                    />
                    <Text style={styles.colonText}>:</Text>
                    <WheelPicker 
                      data={state.options.seconds} 
                      selectedValue={state.alertTime.second} 
                      onSelect={(val) => actions.setAlertTime(prev => ({ ...prev, second: val }))} 
                    />
                    <WheelPicker 
                      data={state.options.amPms} 
                      selectedValue={state.alertTime.amPm} 
                      onSelect={(val) => actions.setAlertTime(prev => ({ ...prev, amPm: val as 'AM' | 'PM' }))} 
                    />
                  </View>
                </View>
              )}
            </View>

            {/* 6) 음성 알림 설정 */}
            <View style={styles.voiceBox}>
              <Text style={[styles.label, { marginBottom: 12, color: '#333' }]}>음성 알림 설정</Text>

              {/* TTS 선택 */}
              <TouchableOpacity 
                style={[styles.radioRow, { marginBottom: 12 }]}
                onPress={() => actions.setSoundType('tts')}
              >
                <View style={[styles.radioOuter, { borderColor: state.soundType === 'tts' ? '#FF8C00' : '#ccc' }]}>
                  {state.soundType === 'tts' && <View style={styles.radioInner} />}
                </View>
                <Text style={{ fontSize: 14, color: '#333' }}>기본 알림용 (TTS)</Text>
              </TouchableOpacity>

              {/* 보호자 음성 녹음 선택 */}
              <TouchableOpacity 
                style={[styles.radioRow, { marginBottom: state.soundType === 'voice' ? 12 : 0 }]}
                onPress={() => actions.setSoundType('voice')}
              >
                <View style={[styles.radioOuter, { borderColor: state.soundType === 'voice' ? '#FF8C00' : '#ccc' }]}>
                  {state.soundType === 'voice' && <View style={styles.radioInner} />}
                </View>
                <Text style={{ fontSize: 14, color: '#333' }}>보호자 음성 녹음</Text>
              </TouchableOpacity>

              {/* 음성 버튼 그룹 */}
              {state.soundType === 'voice' && (
                <View style={styles.actionButtonGroup}>
                  <TouchableOpacity 
                    style={[styles.actionBtn, { borderColor: state.isRecording ? '#ff4d4f' : '#FF9800', marginRight: 6 }]}
                    onPress={actions.handleRecord}
                  >
                    <MicIcon color={state.isRecording ? '#ff4d4f' : '#FF9800'} />
                    <Text style={[styles.actionBtnText, { color: state.isRecording ? '#ff4d4f' : '#FF9800' }]}>
                      {state.isRecording ? '정지' : '녹음'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionBtn, { marginHorizontal: 3 }]}
                    onPress={actions.handlePlay}
                  >
                    <PlayIcon color="#FF9800" />
                    <Text style={styles.actionBtnText}>재생</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionBtn, { marginLeft: 6 }]}
                    onPress={actions.handleDelete}
                  >
                    <CloseIcon color="#FF9800" />
                    <Text style={styles.actionBtnText}>삭제</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* 저장하기 버튼 */}
            <TouchableOpacity style={styles.saveBtn} onPress={actions.handleSave}>
              <Text style={styles.saveBtnText}>저장하기</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};