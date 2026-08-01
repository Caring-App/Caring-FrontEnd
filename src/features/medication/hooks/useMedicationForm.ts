import { useState } from 'react';
import { Alert } from 'react-native';
import { TimeState, SoundType } from '../types/medication';

export const useMedicationForm = () => {
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  // 선택된 프리셋 상태 ('daily' | 'weekday' | 'weekend' | null)
  const [selectedPreset, setSelectedPreset] = useState<'daily' | 'weekday' | 'weekend' | null>(null);

  const [timeState, setTimeState] = useState<TimeState>({
    hour: '06',
    minute: '28',
    second: '55',
    amPm: 'PM',
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [hasTimeSelected, setHasTimeSelected] = useState(false);

  const remindOptions = ['없음', '5분 후', '10분 후', '15분 후', '20분 후', '25분 후', '30분 후'];
  const [selectedRemind, setSelectedRemind] = useState('10분 후');
  const [showRemindPicker, setShowRemindPicker] = useState(false);

  const [soundType, setSoundType] = useState<SoundType>('tts');
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const daysList = ['월', '화', '수', '목', '금', '토', '일'];
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const seconds = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const amPms: ('AM' | 'PM')[] = ['AM', 'PM'];

  const toggleMeal = (meal: string) => {
    if (selectedMeals.includes(meal)) {
      setSelectedMeals(selectedMeals.filter((m) => m !== meal));
    } else {
      setSelectedMeals([...selectedMeals, meal]);
    }
  };

  const updateTimeField = (field: keyof TimeState, value: string) => {
    setTimeState((prev) => ({ ...prev, [field]: value }));
  };

  // 개별 요일 조작 시 프리셋 상태 해제
  const toggleDay = (day: string) => {
    setSelectedPreset(null);
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // 프리셋 선택 시 해당 프리셋을 주황색으로 활성화
  const handlePreset = (type: 'daily' | 'weekday' | 'weekend') => {
    setSelectedPreset(type);
    if (type === 'daily') setSelectedDays(['월', '화', '수', '목', '금', '토', '일']);
    if (type === 'weekday') setSelectedDays(['월', '화', '수', '목', '금']);
    if (type === 'weekend') setSelectedDays(['토', '일']);
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

  return {
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
  };
};