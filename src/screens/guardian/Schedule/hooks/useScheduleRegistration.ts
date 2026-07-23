import { useState } from 'react';
import { Alert } from 'react-native';
import { TimeState, SoundType, ScheduleRegistrationData } from '../types/scheduleModal.types';

export const useScheduleRegistration = (
  onClose: () => void,
  onSave?: (data: ScheduleRegistrationData) => void
) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const seconds = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const amPms: ('AM' | 'PM')[] = ['AM', 'PM'];

  const [scheduleTime, setScheduleTime] = useState<TimeState>({ hour: '06', minute: '28', second: '55', amPm: 'PM' });
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);

  const [alertTime, setAlertTime] = useState<TimeState>({ hour: '06', minute: '28', second: '55', amPm: 'PM' });
  const [showAlertPicker, setShowAlertPicker] = useState(false);

  const [soundType, setSoundType] = useState<SoundType>('tts');
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const handleRecord = () => {
    const nextState = !isRecording;
    setIsRecording(nextState);
    setHasRecorded(true);
    Alert.alert('', nextState ? '녹음을 시작합니다...' : '녹음이 완료되었습니다.');
  };

  const handlePlay = () => {
    if (!hasRecorded) {
      Alert.alert('', '재생할 녹음 파일이 없습니다.');
      return;
    }
    Alert.alert('', '녹음된 음성을 재생합니다.');
  };

  const handleDelete = () => {
    setHasRecorded(false);
    setIsRecording(false);
    Alert.alert('', '녹음 파일이 삭제되었습니다.');
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ title, location, selectedDate, scheduleTime, alertTime, soundType, hasRecorded });
    }
    onClose();
  };

  return {
    state: {
      title,
      location,
      selectedDate,
      scheduleTime,
      showSchedulePicker,
      alertTime,
      showAlertPicker,
      soundType,
      isRecording,
      hasRecorded,
      options: { hours, minutes, seconds, amPms },
    },
    actions: {
      setTitle,
      setLocation,
      setSelectedDate,
      setScheduleTime,
      setShowSchedulePicker,
      setAlertTime,
      setShowAlertPicker,
      setSoundType,
      handleRecord,
      handlePlay,
      handleDelete,
      handleSave,
    },
  };
};