import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { ScheduleRegistrationModal } from '../../guardian/Schedule/ScheduleRegistrationModal';

export function SeniorHomeScreen() {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View className="flex-1 bg-surface">
      <View className="flex-1 items-center justify-center px-4">
  <Text className="text-xl font-bold text-primary">오늘의 건강/복약 체크</Text>
  <TouchableOpacity 
    className="mt-4 p-4 bg-orange-500 rounded-lg" 
    onPress={() => setModalVisible(true)}
  >
    <Text className="text-white font-bold">+ 일정 등록</Text>
  </TouchableOpacity>
</View>

      {/* 모달 컴포넌트 호출 */}
      <ScheduleRegistrationModal 
        visible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </View>
  );
}
export default SeniorHomeScreen;