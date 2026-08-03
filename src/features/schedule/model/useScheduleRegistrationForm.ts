import { useState } from 'react';
import { Alert } from 'react-native';
import { addMonths } from './calendarUtils';
import { ScheduleRegistrationData, ScheduleSoundType, TimeState } from './scheduleRegistrationTypes';

const INITIAL_TIME: TimeState = { hour: '1', minute: '00', second: '00', amPm: 'AM' };

export const LOCATION_OPTIONS = ['장소 1', '장소 2', '장소 3'];

export const useScheduleRegistrationForm = (onClose: () => void, onSave?: (data: ScheduleRegistrationData) => void) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [showLocationOptions, setShowLocationOptions] = useState(false);

  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const [scheduleTime, setScheduleTimeState] = useState<TimeState>(INITIAL_TIME);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [hasScheduleTime, setHasScheduleTime] = useState(false);

  const [alarmTime, setAlarmTimeState] = useState<TimeState>(INITIAL_TIME);
  const [showAlarmPicker, setShowAlarmPicker] = useState(false);
  const [hasAlarmTime, setHasAlarmTime] = useState(false);

  const [soundType, setSoundType] = useState<ScheduleSoundType>('tts');
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const toggleLocationOptions = () => setShowLocationOptions((prev) => !prev);
  const selectLocation = (option: string) => {
    setLocation(option);
    setShowLocationOptions(false);
  };

  const goToPrevMonth = () => setCalendarMonth((prev) => addMonths(prev, -1));
  const goToNextMonth = () => setCalendarMonth((prev) => addMonths(prev, 1));
  const selectDate = (date: Date) => setSelectedDate(date);

  const toggleSchedulePicker = () => setShowSchedulePicker((prev) => !prev);
  const toggleAlarmPicker = () => setShowAlarmPicker((prev) => !prev);

  const setScheduleTime = (next: TimeState) => {
    setScheduleTimeState(next);
    setHasScheduleTime(true);
  };
  const setAlarmTime = (next: TimeState) => {
    setAlarmTimeState(next);
    setHasAlarmTime(true);
  };

  const handleRecord = () => {
    const nextIsRecording = !isRecording;
    setIsRecording(nextIsRecording);
    if (!nextIsRecording) {
      setHasRecorded(true);
    }
  };
  const handlePlay = () => {
    if (!hasRecorded) {
      Alert.alert('', '재생할 녹음이 없습니다.');
      return;
    }
    Alert.alert('', '녹음된 음성을 재생합니다.');
  };
  const handleDeleteRecording = () => {
    setIsRecording(false);
    setHasRecorded(false);
  };

  const handleSave = () => {
    onSave?.({ title, location, date: selectedDate, scheduleTime, alarmTime, soundType });
    onClose();
  };

  return {
    state: {
      title,
      location,
      showLocationOptions,
      calendarMonth,
      selectedDate,
      scheduleTime,
      showSchedulePicker,
      hasScheduleTime,
      alarmTime,
      showAlarmPicker,
      hasAlarmTime,
      soundType,
      isRecording,
      hasRecorded,
    },
    actions: {
      setTitle,
      toggleLocationOptions,
      selectLocation,
      goToPrevMonth,
      goToNextMonth,
      selectDate,
      setScheduleTime,
      toggleSchedulePicker,
      setAlarmTime,
      toggleAlarmPicker,
      setSoundType,
      handleRecord,
      handlePlay,
      handleDeleteRecording,
      handleSave,
    },
  };
};
