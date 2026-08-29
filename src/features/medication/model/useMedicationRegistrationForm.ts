import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import type { TimeState } from '@shared/types';
import { useVoiceRecording } from '@shared/model';
import { logApiError } from '@shared/api';
import { isSameDaySet } from '../utils';
import { MedicationEntry, MedicationRegistrationData, MedicationSoundType, MealType, Weekday } from './medicationTypes';
import { useMedicationListStore } from './useMedicationListStore';

const INITIAL_TIME: TimeState = { hour: '01', minute: '00', second: '00', amPm: 'AM' };

export const MEAL_TYPE_OPTIONS: { value: MealType; label: string }[] = [
  { value: 'morning', label: '아침' },
  { value: 'lunch', label: '점심' },
  { value: 'dinner', label: '저녁' },
];

export const WEEKDAY_OPTIONS: { value: Weekday; label: string }[] = [
  { value: 'mon', label: '월' },
  { value: 'tue', label: '화' },
  { value: 'wed', label: '수' },
  { value: 'thu', label: '목' },
  { value: 'fri', label: '금' },
  { value: 'sat', label: '토' },
  { value: 'sun', label: '일' },
];

export const DAY_PRESETS: { key: 'daily' | 'weekday' | 'weekend'; label: string; days: Weekday[] }[] = [
  { key: 'daily', label: '매일', days: WEEKDAY_OPTIONS.map(option => option.value) },
  { key: 'weekday', label: '주간', days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
  { key: 'weekend', label: '주말', days: ['sat', 'sun'] },
];

export const REMINDER_INTERVAL_OPTIONS = ['5분 후', '10분 후', '15분 후', '20분 후', '30분 후', '1시간 후'];

export const useMedicationRegistrationForm = (
  wardId: number,
  visible: boolean,
  editingMedication: MedicationEntry | null,
  onClose: () => void,
) => {
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);
  const [days, setDays] = useState<Weekday[]>([]);

  const [time, setTimeState] = useState<TimeState>(INITIAL_TIME);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [hasTime, setHasTime] = useState(false);

  const [reminderInterval, setReminderInterval] = useState(REMINDER_INTERVAL_OPTIONS[0]);
  const [showReminderOptions, setShowReminderOptions] = useState(false);

  const [soundType, setSoundType] = useState<MedicationSoundType>('tts');
  const voiceRecording = useVoiceRecording();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }
    if (editingMedication) {
      setMealTypes([editingMedication.mealType]);
      setDays(editingMedication.days);
      setTimeState(editingMedication.time);
      setHasTime(true);
      setReminderInterval(editingMedication.reminderInterval);
      setSoundType(editingMedication.soundType);
    } else {
      setMealTypes([]);
      setDays([]);
      setTimeState(INITIAL_TIME);
      setHasTime(false);
      setReminderInterval(REMINDER_INTERVAL_OPTIONS[0]);
      setSoundType('tts');
    }
    setShowTimePicker(false);
    setShowReminderOptions(false);
    voiceRecording.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, editingMedication]);

  const toggleMealType = (meal: MealType) =>
    setMealTypes(prev => (prev.includes(meal) ? prev.filter(item => item !== meal) : [...prev, meal]));

  const toggleDay = (day: Weekday) =>
    setDays(prev => (prev.includes(day) ? prev.filter(item => item !== day) : [...prev, day]));

  const activeDayPreset = DAY_PRESETS.find(preset => isSameDaySet(days, preset.days))?.key ?? null;

  const toggleDayPreset = (preset: (typeof DAY_PRESETS)[number]) =>
    setDays(activeDayPreset === preset.key ? [] : preset.days);

  const toggleTimePicker = () => setShowTimePicker(prev => !prev);
  const setTime = (next: TimeState) => {
    setTimeState(next);
    setHasTime(true);
  };

  const toggleReminderOptions = () => setShowReminderOptions(prev => !prev);
  const selectReminderInterval = (option: string) => {
    setReminderInterval(option);
    setShowReminderOptions(false);
  };

  const handleSave = async () => {
    if (isSubmitting) {
      return;
    }
    if (mealTypes.length === 0) {
      Alert.alert('', '식사 시간을 선택해주세요.');
      return;
    }
    if (days.length === 0) {
      Alert.alert('', '요일을 선택해주세요.');
      return;
    }
    if (!hasTime) {
      Alert.alert('', '복용 시간을 선택해주세요.');
      return;
    }

    const data: MedicationRegistrationData = { mealTypes, days, time, reminderInterval, soundType };
    setIsSubmitting(true);
    try {
      if (editingMedication) {
        await useMedicationListStore.getState().updateMedication(wardId, editingMedication, data);
      } else {
        await useMedicationListStore.getState().addMedication(wardId, data);
      }
      onClose();
    } catch (error) {
      logApiError('복약 스케줄 저장 실패', error);
      Alert.alert('', '저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state: {
      mealTypes,
      days,
      activeDayPreset,
      time,
      showTimePicker,
      hasTime,
      reminderInterval,
      showReminderOptions,
      soundType,
      isRecording: voiceRecording.isRecording,
      hasRecorded: voiceRecording.hasRecorded,
      isSubmitting,
    },
    actions: {
      toggleMealType,
      toggleDay,
      toggleDayPreset,
      toggleTimePicker,
      setTime,
      toggleReminderOptions,
      selectReminderInterval,
      setSoundType,
      handleRecord: voiceRecording.handleRecord,
      handlePlay: voiceRecording.handlePlay,
      handleDeleteRecording: voiceRecording.handleDeleteRecording,
      handleSave,
    },
  };
};
