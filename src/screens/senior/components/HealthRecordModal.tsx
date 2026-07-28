import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';

interface HealthRecordModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
  diseases?: string[]; // 회원가입 시 체크한 기저질환 목록
}

export function HealthRecordModal({
  isVisible,
  onClose,
  onSubmit,
  diseases = [], // 전달받은 값이 없으면 빈 배열
}: HealthRecordModalProps) {
  const [bloodSugar, setBloodSugar] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');

  if (!isVisible) return null;

  const handleSave = () => {
    onSubmit({
      당뇨: bloodSugar,
      혈압: bloodPressure,
    });

    // 상태 초기화 및 모달 닫기
    setBloodSugar('');
    setBloodPressure('');
    onClose();
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        elevation: 999,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              width: '100%',
              maxWidth: 400,
              backgroundColor: 'white',
              borderRadius: 24,
              padding: 24,
              elevation: 5,
            }}
          >
            {/* 모달 헤더 */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text
                  style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}
                >
                  오늘의 건강 기록하기
                </Text>
                <Text
                  style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}
                >
                  입력하신 수치는 오늘 저녁 보호자님 레포트에 반영됩니다.
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#F3F4F6',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontWeight: 'bold', color: '#4B5563' }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 입력 폼 및 정보 표시 영역 */}
            <View style={{ marginTop: 20, gap: 12 }}>
              {/* 1. 당뇨 수치 입력 */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: 'bold', color: '#374151' }}
                >
                  당뇨 수치 입력
                </Text>
                <TextInput
                  style={{
                    marginTop: 4,
                    height: 40,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    fontSize: 14,
                    color: '#111827',
                  }}
                  placeholder="예: 120"
                  placeholderTextColor="#9CA3AF"
                  value={bloodSugar}
                  onChangeText={setBloodSugar}
                  keyboardType="numeric"
                />
              </View>

              {/* 2. 혈압 수치 입력 */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: 'bold', color: '#374151' }}
                >
                  혈압 수치 입력
                </Text>
                <TextInput
                  style={{
                    marginTop: 4,
                    height: 40,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    fontSize: 14,
                    color: '#111827',
                  }}
                  placeholder="예: 120/80"
                  placeholderTextColor="#9CA3AF"
                  value={bloodPressure}
                  onChangeText={setBloodPressure}
                />
              </View>

              {/* 3. 보유 기저질환 목록 표시 (회원가입 때 체크한 데이터 바인딩) */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 12,
                  padding: 12,
                  backgroundColor: '#F9FAFB',
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: 'bold', color: '#374151' }}
                >
                  보유 기저질환
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginTop: 8 }}
                >
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {diseases.length > 0 ? (
                      diseases.map((item, index) => (
                        <View
                          key={index}
                          style={{
                            backgroundColor: '#FFF7ED',
                            borderWidth: 1,
                            borderColor: '#FFEDD5',
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 20,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: '600',
                              color: '#EA580C',
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text style={{ fontSize: 13, color: '#9CA3AF' }}>
                        등록된 기저질환이 없습니다.
                      </Text>
                    )}
                  </View>
                </ScrollView>
              </View>
            </View>

            {/* 저장하기 버튼 */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSave}
              style={{
                marginTop: 20,
                height: 48,
                backgroundColor: '#FF7F00',
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
              >
                저장하기
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}