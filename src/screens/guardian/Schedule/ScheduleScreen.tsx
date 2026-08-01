import React, { useState } from 'react';
import { View } from 'react-native';
import { ScheduleRegistrationModal } from './ScheduleRegistrationModal';

export const ScheduleScreen = ({ navigation }: { navigation: any }) => {
  const [isModalVisible, setIsModalVisible] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center' }}>
      <ScheduleRegistrationModal 
        visible={isModalVisible} 
        onClose={() => {
          setIsModalVisible(false);
          // 모달을 닫으면서 네비게이션 뒤로 가기 (메인 화면으로 복귀)
          if (navigation && navigation.goBack) {
            navigation.goBack();
          }
        }} 
      />
    </View>
  );
};