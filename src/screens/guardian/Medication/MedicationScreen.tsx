import React, { useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
// 모달 컴포넌트 경로가 정확한지 확인해주세요
import { MedicationRegistrationModal } from '../../../features/medication/components/MedicationRegistrationModal';

export function MedicationScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xl font-bold text-text-primary mb-6">복약 관리</Text>

        {/* 💡 이 버튼을 눌러야 모달의 visible이 true가 됩니다! */}
        <TouchableOpacity
          style={{ backgroundColor: '#FF8C00', padding: 12, borderRadius: 8 }}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ 복약 등록하기</Text>
        </TouchableOpacity>

        {/* 복약 등록 모달 컴포넌트 */}
        <MedicationRegistrationModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={(data) => {
            console.log('저장된 데이터:', data);
            setIsModalVisible(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
}