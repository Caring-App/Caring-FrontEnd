import React, { useState } from 'react';
import { View } from 'react-native';
import { ScheduleRegistrationModal } from './ScheduleRegistrationModal';

// 만약 네비게이션 타입 정의가 있다면 해당 타입을 사용하시고, 없다면 아래 구조를 참고하세요.
export const ScheduleScreen = ({ navigation }: { navigation: any }) => {
  const [isModalVisible, setIsModalVisible] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
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