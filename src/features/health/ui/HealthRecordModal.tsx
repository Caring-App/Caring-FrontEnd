import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { FormLabel } from '@shared/ui';
import { useHealthRecordForm } from '../model';

interface HealthRecordModalProps {
  visible: boolean;
  wardId: string;
  onClose: () => void;
}

// 돌봄대상자 메인 화면의 "오늘의 건강 기록하기" 버튼으로 여는 모달. 당뇨/혈압 수치, 체중을
// 입력하고 저장하면 useHealthRecordStore에 반영됨(추후 보호자 저녁 레포트 연동 대상)
export function HealthRecordModal({ visible, wardId, onClose }: HealthRecordModalProps) {
  const { state, actions } = useHealthRecordForm(wardId, visible);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/30 px-5" onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="w-full max-h-[85%]">
          <Pressable onPress={() => {}} className="max-h-full rounded-card border border-border bg-surface p-4">
            <Text className="font-pretendard-bold text-xl text-text-primary">오늘의 건강 기록하기</Text>
            <Text className="mt-1 text-xs font-pretendard-medium text-text-muted">
              입력하신 수치는 오늘 저녁 보호자님 레포트에 반영됩니다.
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
              <View className="gap-4">
                <HealthRecordField
                  label="당뇨 수치 입력"
                  placeholder="당뇨 수치를 입력하세요"
                  value={state.bloodSugar}
                  onChangeText={actions.setBloodSugar}
                />
                <HealthRecordField
                  label="혈압 수치 입력"
                  placeholder="혈압 수치를 입력하세요"
                  value={state.bloodPressure}
                  onChangeText={actions.setBloodPressure}
                />
                <HealthRecordField
                  label="체중 입력"
                  placeholder="체중을 입력하세요"
                  value={state.weight}
                  onChangeText={actions.setWeight}
                />
              </View>

              <Pressable
                onPress={() => actions.handleSave(onClose)}
                className="mt-6 items-center justify-center rounded-card bg-primary py-4">
                <Text className="font-pretendard-semibold text-xl text-white">저장하기</Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

function HealthRecordField({
  label,
  placeholder,
  value,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View className="rounded-card border border-border p-3">
      <FormLabel>{label}</FormLabel>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6C757D"
        keyboardType="numeric"
        className="mt-2 rounded-[8px] border border-border-input px-3.5 py-2 font-pretendard text-md text-text-primary"
      />
    </View>
  );
}
