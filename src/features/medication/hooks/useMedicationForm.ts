import { useState } from 'react';
import { Alert } from 'react-native';
import { MedicationFormState } from '../types/medication';

export const useMedicationForm = (onClose: () => void, onSave?: (data: MedicationFormState) => void) => {
  const [medicationName, setMedicationName] = useState('');
  const [timeCategory, setTimeCategory] = useState<'아침' | '점심' | '저녁'>('아침');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  const [medTime, setMedTime] = useState({ hour: '06', minute: '28', second: '55', amPm: 'PM' as 'AM' | 'PM' });
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [remindInterval, setRemindInterval] = useState('10분 후');
  const [showRemindDropdown, setShowRemindDropdown] = useState(false);

  const [soundType, setSoundType] = useState<'tts' | 'voice'>('tts');
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const daysList = ['월', '화', '수', '목', '금', '토', '일'];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

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
      onSave({
        medicationName,
        timeCategory,
        selectedDays,
        medTime,
        remindInterval,
        soundType,
        hasRecorded,
      });
    }
    onClose();
  };

  return {
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
  };
};