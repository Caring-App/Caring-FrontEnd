import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { FormLabel } from '@shared/ui';
import { colors } from '@shared/theme/colors';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, 어르신 글자 크기 배율은
// ward-management가 유일한 소스라(useWardFontScaleStore) 이 화면에서도 그대로 가져다 씀
// (순환참조 없음, ward-management는 health를 참조하지 않음).
import { useWardFontScaleStore } from '@features/ward-management/model';
import { WardText } from '@features/ward-management/ui';
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
            <WardText size="xl" className="font-pretendard-bold text-text-primary">
              오늘의 건강 기록하기
            </WardText>
            <WardText size="xs" className="mt-1 font-pretendard-medium text-text-muted">
              입력하신 수치는 오늘 저녁 보호자님 레포트에 반영됩니다.
            </WardText>

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
                <WardText size="xl" className="font-pretendard-semibold text-white">
                  저장하기
                </WardText>
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
  // TextInput은 WardText(Text 전용)를 못 써서 글자 크기 배율을 직접 계산해서 style로 넣음
  const fontScale = useWardFontScaleStore(state => state.scale);

  return (
    <View className="rounded-card border border-border p-3">
      <FormLabel>{label}</FormLabel>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        keyboardType="numeric"
        style={{ fontSize: 15 * fontScale }}
        className="mt-2 rounded-[8px] border border-border-input px-3.5 py-2 font-pretendard text-text-primary"
      />
    </View>
  );
}
