import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import PlusIcon from '@assets/icons/action/plus.svg';
import { logApiError } from '@shared/api';
import { useSelectedWard } from '@features/ward-management/model';
import { MedicationEntry, useMedicationListStore } from '@features/medication/model';
import { MedicationListItem, MedicationRegistrationModal } from '@features/medication/ui';
import { sortMedicationsByTime } from '@features/medication/utils';
import { MEDICATION_MODAL_STEP_INDEX, useTourStore } from '@features/guardian-tour/model';
import { showNotice } from '@shared/model';
import { NoLinkedWardNotice } from '@features/ward-management/ui';

export function MedicationScreen() {
  const navigation = useNavigation();
  const { ward } = useSelectedWard();
  // 연동된 어르신이 없으면 NaN — Number('')는 0이라 빈 id를 그대로 바꾸면 0번 어르신을 조회하게 됨
  const wardIdNumber = ward ? Number(ward.id) : NaN;
  const medications = useMedicationListStore(state => state.medicationsByWard[wardIdNumber]) ?? [];
  const sortedMedications = sortMedicationsByTime(medications);
  const toggleEnabled = useMedicationListStore(state => state.toggleEnabled);
  const togglingIds = useMedicationListStore(state => state.togglingIds);
  const fetchMedications = useMedicationListStore(state => state.fetchMedications);

  useEffect(() => {
    if (!Number.isNaN(wardIdNumber)) {
      fetchMedications(wardIdNumber);
    }
  }, [wardIdNumber, fetchMedications]);

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
          disabled={!ward}
          className="flex-row items-center gap-1.5 rounded-card border border-border px-3.5 py-2">
          <PlusIcon width={12} height={12} />
          <Text className="font-pretendard-semibold text-base text-text-strong">복약 등록</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="gap-4 py-4"
        showsVerticalScrollIndicator={false}>
        {/* 사용 가이드를 이 화면에서 끝내면 투어용 목업 어르신이 사라져 연동된 어르신이 없는 상태가 될 수 있음 */}
        {!ward && <NoLinkedWardNotice />}
        {sortedMedications.map(entry => (
          <MedicationListItem
            key={entry.id}
            entry={entry}
            onEdit={() => openEdit(entry)}
            isToggling={togglingIds.has(entry.id)}
            onToggleEnabled={() => {
              toggleEnabled(wardIdNumber, entry.id).catch(error => {
                logApiError('복약 스케줄 상태 변경 실패', error);
                showNotice('', '상태 변경에 실패했습니다. 잠시 후 다시 시도해주세요.');
              });
            }}
          />
        ))}
      </ScrollView>

      <MedicationRegistrationModal
        visible={isRegistrationVisible && !!ward}
        wardId={wardIdNumber}
        wardName={ward?.name ?? ''}
        editingMedication={editingMedication}
        onClose={closeRegistration}
      />
    </SafeAreaView>
  );
}
