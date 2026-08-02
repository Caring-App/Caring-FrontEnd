import { useState } from 'react';
import { Alert } from 'react-native';
import { EmotionType, ScheduleItem, MedicationStatus } from '../types/senior';

export const useSeniorHome = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 💡 회원가입 시 체크한 기저질환 목록 데이터
  // (나중에 API나 UserContext에서 받아온 데이터를 연결하시면 됩니다)
  const [userDiseases] = useState<string[]>(['고혈압', '당뇨']); 

  const [schedules] = useState<ScheduleItem[]>([]);
  const [medicationStatus, setMedicationStatus] = useState<MedicationStatus>({
    morning: false,
    lunch: false,
    dinner: false,
  });

  const todayDateText = `${new Date().getMonth() + 1}월 ${new Date().getDate()}일`;

  const handleSelectEmotion = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);
  };

  const handleOpenHealthModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseHealthModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitHealthData = async (healthValues: Record<string, string>) => {
    try {
      console.log('저장할 건강 정보:', {
        selectedEmotion,
        healthValues,
      });

      Alert.alert('성공', '오늘의 건강 상태가 보호자에게 전달되었습니다.');
    } catch (error) {
      Alert.alert('오류', '건강 상태를 전달하지 못했습니다.');
    }
  };

  const handleToggleMedication = async (time: keyof MedicationStatus) => {
    const nextValue = !medicationStatus[time];
    setMedicationStatus((prev) => ({ ...prev, [time]: nextValue }));
  };

  const handleListenSchedule = () => {
    if (schedules.length === 0) {
      Alert.alert('일정 안내', '오늘 등록된 일정이 없습니다.');
      return;
    }
    const scheduleText = schedules.map((item) => `${item.time} ${item.title}`).join(', ');
    Alert.alert('일정 읽기', `오늘의 일정입니다. ${scheduleText}`);
  };

  return {
    selectedEmotion,
    schedules,
    todayDateText,
    medicationStatus,
    isModalOpen,
    userDiseases, // 👈 기저질환 배열 데이터 리턴
    handleSelectEmotion,
    handleOpenHealthModal,
    handleCloseHealthModal,
    handleSubmitHealthData,
    handleToggleMedication,
    handleListenSchedule,
  };
};