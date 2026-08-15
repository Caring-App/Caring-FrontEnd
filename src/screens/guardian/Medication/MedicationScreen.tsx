import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import PlusIcon from '@assets/icons/action/plus.svg';
import { MOCK_WARDS, useSelectedWardStore } from '@features/ward-management/model';
import { MedicationEntry, useMedicationListStore } from '@features/medication/model';
import { MedicationListItem, MedicationRegistrationModal } from '@features/medication/ui';
import { sortMedicationsByTime } from '@features/medication/utils';
import { MEDICATION_MODAL_STEP_INDEX, useTourStore } from '@features/guardian-tour/model';

export function MedicationScreen() {
  const navigation = useNavigation();
  const selectedWardId = useSelectedWardStore(state => state.selectedWardId);
  const ward = MOCK_WARDS.find(item => item.id === selectedWardId) ?? MOCK_WARDS[0];
  const medications = useMedicationListStore(state => state.medicationsByWard[selectedWardId]) ?? [];
  const sortedMedications = sortMedicationsByTime(medications);
  const toggleEnabled = useMedicationListStore(state => state.toggleEnabled);

  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);
  const [editingMedication, setEditingMedication] = useState<MedicationEntry | null>(null);

  const openCreate = () => {
    setEditingMedication(null);
    setIsRegistrationVisible(true);
  };
  const openEdit = (entry: MedicationEntry) => {
    setEditingMedication(entry);
    setIsRegistrationVisible(true);
  };
  const closeRegistration = () => {
    setIsRegistrationVisible(false);
    setEditingMedication(null);
  };

  // 사용가이드가 "복약 등록" 단계를 지나 다음 스텝(홈 화면 쪽)으로 넘어가면 이 화면을 자동으로 닫고
  // 홈으로 돌아감 — 안 그러면 이후 스텝들이 이 화면 위에 떠서 하이라이트만 보이고 배경은 여전히
  // 복약 관리 목록인 상태가 됨
  const isTourActive = useTourStore(state => state.isActive);
  const tourStepIndex = useTourStore(state => state.currentStepIndex);
  useEffect(() => {
    if (isTourActive && MEDICATION_MODAL_STEP_INDEX !== -1 && tourStepIndex > MEDICATION_MODAL_STEP_INDEX) {
      navigation.goBack();
    }
  }, [isTourActive, tourStepIndex, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
        <View className="flex-row items-center gap-2">
          <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
            <ChevronRightIcon width={24} height={24} />
          </Pressable>
          <Text className="text-xl font-bold text-text-primary">복약 관리</Text>
        </View>
        <Pressable
          onPress={openCreate}
          className="flex-row items-center gap-1.5 rounded-card border border-border px-3.5 py-2">
          <PlusIcon width={12} height={12} />
          <Text className="font-pretendard-semibold text-base text-text-strong">복약 등록</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="gap-4 py-4"
        showsVerticalScrollIndicator={false}>
        {sortedMedications.map(entry => (
          <MedicationListItem
            key={entry.id}
            entry={entry}
            onEdit={() => openEdit(entry)}
            onToggleEnabled={() => toggleEnabled(selectedWardId, entry.id)}
          />
        ))}
      </ScrollView>

      <MedicationRegistrationModal
        visible={isRegistrationVisible}
        wardId={selectedWardId}
        wardName={ward.name}
        editingMedication={editingMedication}
        onClose={closeRegistration}
      />
    </SafeAreaView>
  );
}
