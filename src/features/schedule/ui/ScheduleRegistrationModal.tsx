import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import CalendarEventIcon from '@assets/icons/section/calendar-event.svg';
import CloseIcon from '@assets/icons/action/close-x.svg';
import ClockIcon from '@assets/icons/schedule/clock.svg';
import ChevronDownIcon from '@assets/icons/section/chevron-down-select.svg';
import { LOCATION_OPTIONS, useScheduleRegistrationForm } from '../model/useScheduleRegistrationForm';
import { ScheduleEntry } from '../model/scheduleRegistrationTypes';
import { ScheduleCalendarPicker } from './ScheduleCalendarPicker';
import { WheelTimePicker } from './WheelTimePicker';
import { VoiceRecordingControls } from './VoiceRecordingControls';

interface ScheduleRegistrationModalProps {
  visible: boolean;
  wardId: string;
  wardName: string;
  editingSchedule: ScheduleEntry | null;
  onClose: () => void;
}

function FormLabel({ children }: { children: string }) {
  return <Text className="mb-2 font-pretendard-semibold text-lg text-text-body">{children}</Text>;
}

function TimeTriggerInput({ placeholder, valueLabel, onPress }: { placeholder: string; valueLabel?: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-md border border-border-input bg-surface px-3.5 py-2">
      <Text className={`font-pretendard text-lg ${valueLabel ? 'text-text-primary' : 'text-text-placeholder'}`}>
        {valueLabel ?? placeholder}
      </Text>
      <ClockIcon width={20} height={20} />
    </Pressable>
  );
}

function formatTime(time: { hour: string; minute: string; second: string; amPm: 'AM' | 'PM' }) {
  return `${time.amPm} ${time.hour}:${time.minute}:${time.second}`;
}

export function ScheduleRegistrationModal({
  visible,
  wardId,
  wardName,
  editingSchedule,
  onClose,
}: ScheduleRegistrationModalProps) {
  const { state, actions } = useScheduleRegistrationForm(wardId, visible, editingSchedule, onClose);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/30 px-5">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="w-full max-h-[85%]">
        <View className="max-h-full rounded-card border border-border bg-surface p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <CalendarEventIcon width={20} height={20} />
              <Text className="font-pretendard-bold text-xl text-text-primary">
                {wardName}님 일정 {editingSchedule ? '수정' : '등록'}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <CloseIcon width={16} height={16} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-5 rounded-card border border-border px-3.5 pb-3.5 pt-5">
              <View>
                <FormLabel>일정 이름</FormLabel>
                <TextInput
                  value={state.title}
                  onChangeText={actions.setTitle}
                  placeholder="일정 이름을 입력하세요"
                  placeholderTextColor="#6C757D"
                  className="rounded-md border border-border-input px-3.5 py-2 font-pretendard text-lg text-text-primary"
                />
              </View>

              <View>
                <FormLabel>장소</FormLabel>
                <Pressable
                  onPress={actions.toggleLocationOptions}
                  className="flex-row items-center justify-between rounded-md border border-border-input px-3.5 py-2">
                  <Text className={`font-pretendard text-lg ${state.location ? 'text-text-primary' : 'text-text-placeholder'}`}>
                    {state.location || '장소를 선택 하세요'}
                  </Text>
                  <ChevronDownIcon width={11} height={7} />
                </Pressable>
                {state.showLocationOptions && (
                  <View className="mt-1 rounded-md border border-border-divider bg-surface py-1">
                    {LOCATION_OPTIONS.map((option) => (
                      <Pressable key={option} onPress={() => actions.selectLocation(option)} className="px-4 py-2">
                        <Text className="font-pretendard text-lg text-text-body">{option}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <ScheduleCalendarPicker
                month={state.calendarMonth}
                selectedDate={state.selectedDate}
                onPrevMonth={actions.goToPrevMonth}
                onNextMonth={actions.goToNextMonth}
                onSelectDate={actions.selectDate}
              />
            </View>

            <View className="mt-5">
              <FormLabel>일정 시간</FormLabel>
              <TimeTriggerInput
                placeholder="일정 시간을 선택하세요"
                valueLabel={state.hasScheduleTime ? formatTime(state.scheduleTime) : undefined}
                onPress={actions.toggleSchedulePicker}
              />
              {state.showSchedulePicker && (
                <View className="mt-2">
                  <WheelTimePicker value={state.scheduleTime} onChange={actions.setScheduleTime} />
                </View>
              )}
            </View>

            <View className="mt-5">
              <FormLabel>음성 알림 시간</FormLabel>
              <TimeTriggerInput
                placeholder="알림을 전달 할 시간을 선택하세요"
                valueLabel={state.hasAlarmTime ? formatTime(state.alarmTime) : undefined}
                onPress={actions.toggleAlarmPicker}
              />
              {state.showAlarmPicker && (
                <View className="mt-2">
                  <WheelTimePicker value={state.alarmTime} onChange={actions.setAlarmTime} />
                </View>
              )}
            </View>

            <View className="mt-5 rounded-card border border-border p-4">
              <Text style={{ marginBottom: 21 }} className="font-pretendard-bold text-base text-text-primary">
                음성 알림 설정
              </Text>
              {(
                [
                  { type: 'tts' as const, label: '기본 알림음 (TTS)' },
                  { type: 'voice' as const, label: '보호자 음성 녹음' },
                ]
              ).map(({ type, label }) => {
                const active = state.soundType === type;
                return (
                  <View key={type} style={{ marginBottom: 7 }} className="last:mb-0">
                    <Pressable
                      onPress={() => actions.setSoundType(type)}
                      style={{ gap: 10 }}
                      className="flex-row items-center">
                      <View
                        className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                          active ? 'border-primary' : 'border-border-input'
                        }`}>
                        {active && <View className="h-3 w-3 rounded-full bg-primary" />}
                      </View>
                      <Text className="font-pretendard-semibold text-lg text-text-body">{label}</Text>
                    </Pressable>
                    {type === 'voice' && active && (
                      <VoiceRecordingControls
                        isRecording={state.isRecording}
                        onRecord={actions.handleRecord}
                        onPlay={actions.handlePlay}
                        onDelete={actions.handleDeleteRecording}
                      />
                    )}
                  </View>
                );
              })}
            </View>

            <Pressable
              onPress={actions.handleSave}
              className="mt-5 items-center justify-center rounded-md bg-primary py-4">
              <Text className="font-pretendard-semibold text-xl text-white">저장하기</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
