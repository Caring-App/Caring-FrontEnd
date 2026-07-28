import React from 'react';
import { ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// 공통 UI 컴포넌트
import { AppHeader } from '@shared/ui';

// 커스텀 훅 및 서브 카드 컴포넌트
import { useSeniorHome } from './hooks/useSeniorHome';
import { HealthStatusCard } from './components/HealthStatusCard';
import { ScheduleCard } from './components/ScheduleCard';
import { MedicationCard } from './components/MedicationCard';
import { HealthRecordModal } from './components/HealthRecordModal';

export default function SeniorHomeScreen() {
  const navigation = useNavigation<any>();

  const {
    selectedEmotion,
    schedules,
    todayDateText,
    medicationStatus,
    isModalOpen,
    userDiseases, // 👈 훅에서 가져온 기저질환 목록
    handleSelectEmotion,
    handleOpenHealthModal,
    handleCloseHealthModal,
    handleSubmitHealthData,
    handleToggleMedication,
    handleListenSchedule,
  } = useSeniorHome();

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: () => {
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface pt-4 relative" edges={['top']}>
      {/* 1. 상단 앱 헤더 */}
      <AppHeader onLogout={handleLogout} />

      {/* 2. 메인 스크롤 콘텐츠 */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
          paddingTop: 12,
        }}
      >
        {/* 오늘의 건강 상태 카드 */}
        <HealthStatusCard
          selectedEmotion={selectedEmotion}
          onSelectEmotion={handleSelectEmotion}
          onRecord={handleOpenHealthModal}
        />

        {/* 일정 관리 카드 */}
        <ScheduleCard
          dateText={todayDateText}
          schedules={schedules}
          onListen={handleListenSchedule}
        />

        {/* 복약 관리 카드 */}
        <MedicationCard
          status={medicationStatus}
          onToggleMedication={handleToggleMedication}
        />
      </ScrollView>

      {/* 3. 건강 기록 모달 */}
      <HealthRecordModal
        isVisible={isModalOpen}
        onClose={handleCloseHealthModal}
        diseases={userDiseases} // 👈 기저질환 배열 직접 바인딩
        onSubmit={handleSubmitHealthData}
      />
    </SafeAreaView>
  );
}