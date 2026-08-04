import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ConfirmModal, FormLabel, SoundSettingsCard, TimeTriggerInput, WheelTimePicker, formatTime } from '@shared/ui';
import CapsuleIcon from '@assets/icons/medication/capsule-on.svg';
import CloseIcon from '@assets/icons/action/close-x.svg';
import ChevronDownIcon from '@assets/icons/section/chevron-down-select.svg';
import {
  DAY_PRESETS,
  MEAL_TYPE_OPTIONS,
  REMINDER_INTERVAL_OPTIONS,
  WEEKDAY_OPTIONS,
  useMedicationRegistrationForm,
} from '../model/useMedicationRegistrationForm';
import { MedicationEntry } from '../model/medicationTypes';
import { useMedicationListStore } from '../model/useMedicationListStore';

interface MedicationRegistrationModalProps {
  visible: boolean;
  wardId: string;
  wardName: string;
  editingMedication: MedicationEntry | null;
  onClose: () => void;
}

function CardTitle({ children }: { children: string }) {
  return <Text className="mb-4 font-pretendard-bold text-lg text-text-primary">{children}</Text>;
}

export function MedicationRegistrationModal({
  visible,
  wardId,
  wardName,
  editingMedication,
  onClose,
}: MedicationRegistrationModalProps) {
  const { state, actions } = useMedicationRegistrationForm(wardId, visible, editingMedication, onClose);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  const handleDelete = () => {
    if (editingMedication) {
      useMedicationListStore.getState().deleteMedication(wardId, editingMedication.id);
    }
    setIsDeleteConfirmVisible(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/30 px-5">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="w-full max-h-[85%]">
          <View className="max-h-full rounded-card border border-border bg-surface p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <CapsuleIcon width={20} height={18} />
                <Text className="font-pretendard-bold text-xl text-text-primary">
                  {wardName}님 복약 {editingMedication ? '수정' : '등록'}
                </Text>
              </View>
              <Pressable onPress={onClose} hitSlop={8}>
                <CloseIcon width={16} height={16} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-3 rounded-card border border-border px-3.5 pb-3.5 pt-5">
                <View>
                  <FormLabel>약 이름</FormLabel>
                  <TextInput
                    value={state.name}
                    onChangeText={actions.setName}
                    placeholder="약 이름을 입력하세요"
                    placeholderTextColor="#6C757D"
                    className="rounded-md border border-border-input px-3.5 py-2 font-pretendard text-lg text-text-primary"
                  />
                </View>

                <View className="flex-row gap-2">
                  {MEAL_TYPE_OPTIONS.map(option => {
                    const selected = state.mealTypes.includes(option.value);
                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => actions.toggleMealType(option.value)}
                        className={`h-[38px] flex-1 items-center justify-center rounded-card border-2 ${
                          selected ? 'border-primary' : 'border-border-link'
                        }`}>
                        <Text className="font-pretendard-semibold text-md text-text-strong">{option.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="mt-5 rounded-card border border-border p-4">
                <CardTitle>요일 선택</CardTitle>
                <View className="flex-row justify-between">
                  {WEEKDAY_OPTIONS.map(option => {
                    const selected = state.days.includes(option.value);
                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => actions.toggleDay(option.value)}
                        className={`h-[35px] w-[35px] items-center justify-center rounded-full border-2 ${
                          selected ? 'border-primary' : 'border-border-link'
                        }`}>
                        <Text className="font-pretendard-medium text-xl text-text-calendarDay">{option.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                <View className="mt-3 flex-row gap-2">
                  {DAY_PRESETS.map(preset => {
                    const active = state.activeDayPreset === preset.key;
                    return (
                      <Pressable
                        key={preset.key}
                        onPress={() => actions.toggleDayPreset(preset)}
                        className={`flex-1 items-center justify-center rounded-lg py-1.5 ${
                          active ? 'bg-primary' : 'bg-chip-inactive'
                        }`}>
                        <Text className="font-pretendard-semibold text-md text-text-onChip">{preset.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="mt-5 rounded-card border border-border p-4">
                <CardTitle>시간 선택</CardTitle>
                <View className="-mx-4 mb-4 h-px bg-border-divider" />

                <FormLabel>복용 시간</FormLabel>
                <TimeTriggerInput
                  placeholder="복용 시간을 선택하세요"
                  valueLabel={state.hasTime ? formatTime(state.time) : undefined}
                  onPress={actions.toggleTimePicker}
                />
                {state.showTimePicker && (
                  <View className="mt-2">
                    <WheelTimePicker value={state.time} onChange={actions.setTime} />
                  </View>
                )}

                <View className="mt-5">
                  <FormLabel>미복용 시 재알림 기간</FormLabel>
                  <Pressable
                    onPress={actions.toggleReminderOptions}
                    className="flex-row items-center justify-between rounded-md border border-border-input px-3.5 py-2">
                    <Text className="font-pretendard text-lg text-text-primary">{state.reminderInterval}</Text>
                    <ChevronDownIcon width={11} height={7} />
                  </Pressable>
                  {state.showReminderOptions && (
                    <View className="mt-1 rounded-md border border-border-divider bg-surface py-1">
                      {REMINDER_INTERVAL_OPTIONS.map(option => (
                        <Pressable key={option} onPress={() => actions.selectReminderInterval(option)} className="px-4 py-2">
                          <Text className="font-pretendard text-lg text-text-body">{option}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <SoundSettingsCard
                soundType={state.soundType}
                onChangeSoundType={actions.setSoundType}
                isRecording={state.isRecording}
                onRecord={actions.handleRecord}
                onPlay={actions.handlePlay}
                onDelete={actions.handleDeleteRecording}
              />

              <Pressable
                onPress={actions.handleSave}
                className="mt-5 items-center justify-center rounded-md bg-primary py-4">
                <Text className="font-pretendard-semibold text-2xl text-white">저장하기</Text>
              </Pressable>

              {editingMedication && (
                <Pressable onPress={() => setIsDeleteConfirmVisible(true)} className="mt-4 items-center self-center">
                  <Text className="border-b border-border-danger font-pretendard-light text-lg text-text-danger">
                    복약 정보 삭제하기
                  </Text>
                </Pressable>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>

      <ConfirmModal
        visible={isDeleteConfirmVisible}
        title="복약 정보를 삭제 하시겠어요?"
        onCancel={() => setIsDeleteConfirmVisible(false)}
        onConfirm={handleDelete}
      />
    </Modal>
  );
}
