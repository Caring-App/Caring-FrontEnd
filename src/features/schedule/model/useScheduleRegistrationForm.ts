import { useState } from 'react';
import { addMonths } from './calendarUtils';
import { ScheduleRegistrationData, ScheduleSoundType, TimeState } from './scheduleRegistrationTypes';

const INITIAL_TIME: TimeState = { hour: '06', minute: '27', second: '54', amPm: 'AM' };

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
      handleSave,
    },
  };
};
