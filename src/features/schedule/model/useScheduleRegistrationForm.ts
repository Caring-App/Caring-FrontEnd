import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { addMonths } from './calendarUtils';
import { ScheduleEntry, ScheduleRegistrationData, ScheduleSoundType, TimeState } from './scheduleRegistrationTypes';
import { useScheduleStore } from './useScheduleStore';

const INITIAL_TIME: TimeState = { hour: '1', minute: '00', second: '00', amPm: 'AM' };

export const LOCATION_OPTIONS = ['장소 1', '장소 2', '장소 3'];

export const useScheduleRegistrationForm = (
  wardId: string,
  visible: boolean,
  editingSchedule: ScheduleEntry | null,
  onClose: () => void,
) => {
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

  useEffect(() => {
    if (!visible) {
      return;
    }
    if (editingSchedule) {
      setTitle(editingSchedule.title);
      setLocation(editingSchedule.location);
      setCalendarMonth(editingSchedule.date);
      setSelectedDate(editingSchedule.date);
      setScheduleTimeState(editingSchedule.scheduleTime);
      setHasScheduleTime(true);
      setAlarmTimeState(editingSchedule.alarmTime);
      setHasAlarmTime(true);
      setSoundType(editingSchedule.soundType);
    } else {
      const now = new Date();
      setTitle('');
      setLocation('');
      setCalendarMonth(now);
      setSelectedDate(now);
      setScheduleTimeState(INITIAL_TIME);
      setHasScheduleTime(false);
      setAlarmTimeState(INITIAL_TIME);
      setHasAlarmTime(false);
      setSoundType('tts');
    }
    setShowLocationOptions(false);
    setShowSchedulePicker(false);
    setShowAlarmPicker(false);
    setIsRecording(false);
    setHasRecorded(false);
  }, [visible, editingSchedule]);

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
    const data: ScheduleRegistrationData = { title, location, date: selectedDate, scheduleTime, alarmTime, soundType };
    if (editingSchedule) {
      useScheduleStore.getState().updateSchedule(wardId, editingSchedule.id, data);
    } else {
      useScheduleStore.getState().addSchedule(wardId, data);
    }
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
