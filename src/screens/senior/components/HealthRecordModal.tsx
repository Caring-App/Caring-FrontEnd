// src/screens/senior/Home/HealthRecordModal.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

interface HealthRecordModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { bloodSugar: string; bloodPressure: string; weight: string }) => void;
}

export function HealthRecordModal({ visible, onClose, onSave }: HealthRecordModalProps) {
  const [bloodSugar, setBloodSugar] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [weight, setWeight] = useState('');

  const handleSave = () => {
    onSave({ bloodSugar, bloodPressure, weight });
    // 입력값 초기화
    setBloodSugar('');
    setBloodPressure('');
    setWeight('');
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}
      >
        <View style={{ width: '100%', maxWidth: 400, backgroundColor: 'white', borderRadius: 16, padding: 24, elevation: 5 }}>
          {/* 모달 헤더 */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>오늘의 건강 기록하기</Text>
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>입력하신 수치는 오늘 저녁 보호자님 레포트에 반영됩니다.</Text>
            </View>
            <TouchableOpacity 
              onPress={onClose}
              style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}
            >
              <Text style={{ fontWeight: 'bold', color: '#4B5563' }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 입력 필드 영역 */}
          <View style={{ marginTop: 24, gap: 12 }}>
            <View style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151' }}>당뇨 수치 입력</Text>
              <TextInput
                style={{ marginTop: 4, height: 40, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: '#111827' }}
                placeholder="예: 120"
                placeholderTextColor="#9CA3AF"
                value={bloodSugar}
                onChangeText={setBloodSugar}
                keyboardType="numeric"
              />
            </View>

            <View style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151' }}>혈압 수치 입력</Text>
              <TextInput
                style={{ marginTop: 4, height: 40, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: '#111827' }}
                placeholder="예: 120/80"
                placeholderTextColor="#9CA3AF"
                value={bloodPressure}
                onChangeText={setBloodPressure}
              />
            </View>

            <View style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151' }}>체중 입력</Text>
              <TextInput
                style={{ marginTop: 4, height: 40, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: '#111827' }}
                placeholder="예: 65.5"
                placeholderTextColor="#9CA3AF"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* 저장하기 버튼 */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handleSave}
            style={{ marginTop: 24, height: 48, backgroundColor: '#FF7F00', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>저장하기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}