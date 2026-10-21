import React, { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import { AppHeader } from '@shared/ui';
import { useGuardianMenuStore } from '@features/guardian-menu/model';
import { useTourScrollTracking } from '@features/guardian-tour/model';
import { TourOverlay, TourTarget } from '@features/guardian-tour/ui';
import { WardInfoUpdate, useSelectedWardStore, useWardManagement } from '@features/ward-management/model';
import { EditWardModal, NoLinkedWardNotice, WardCard } from '@features/ward-management/ui';

type GuardianStackNavigationProp = NativeStackNavigationProp<GuardianStackParamList>;

export function WardManagementScreen() {
  const navigation = useNavigation();
  const stackNavigation = navigation.getParent<GuardianStackNavigationProp>();
  const { wards, saveWardInfo, saveWardSetting } = useWardManagement();
  const [editingWardId, setEditingWardId] = useState<string | null>(null);
  // TTS 속도 슬라이더를 움직이기 시작할 때의 값 — 움직이는 동안 화면 값이 계속 바뀌어서, 저장 실패 시 되돌릴 값을 따로 기억함
  const ttsRateBeforeSlideRef = useRef<Record<string, number>>({});
  const tourScroll = useTourScrollTracking('wardManagement');

  const editingWard = wards.find(ward => ward.id === editingWardId) ?? null;

  async function handleSaveWard(update: WardInfoUpdate) {
    if (!editingWard) return;
    const success = await saveWardInfo(editingWard.id, update);
    if (success) {
      setEditingWardId(null);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <AppHeader
        onPressBell={() => stackNavigation?.navigate('Notification')}
        onPressMenu={() => useGuardianMenuStore.getState().open()}
      />
      <ScrollView
        ref={tourScroll.ref}
        className="flex-1 px-4"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
        {...tourScroll.scrollHandlers}>
        <TourTarget id="wardManagement.section" className="mt-4">
          <View className="rounded-card border border-border bg-surface p-4">
            <Text className="text-xl font-pretendard-bold text-text-primary">돌봄대상자 관리</Text>
            <View className="mt-4 gap-4">
              {wards.length === 0 && <NoLinkedWardNotice />}
              {wards.map(ward => (
                <WardCard
                  key={ward.id}
                  ward={ward}
                  onChangeTtsRate={rate => {
                    if (!(ward.id in ttsRateBeforeSlideRef.current)) {
                      ttsRateBeforeSlideRef.current[ward.id] = ward.ttsRate;
                    }
                    useSelectedWardStore.getState().updateWard(ward.id, { ttsRate: rate });
                  }}
                  onCommitTtsRate={rate => {
                    const before = ttsRateBeforeSlideRef.current[ward.id] ?? ward.ttsRate;
                    delete ttsRateBeforeSlideRef.current[ward.id];
                    saveWardSetting(ward.id, { ttsRate: rate }, { ttsRate: before });
                  }}
                  onChangeFontSize={size => {
                    useSelectedWardStore.getState().updateWard(ward.id, { fontSize: size });
                    saveWardSetting(ward.id, { fontSize: size }, { fontSize: ward.fontSize });
                  }}
                  onPressEdit={() => setEditingWardId(ward.id)}
                />
              ))}
            </View>
          </View>
        </TourTarget>
      </ScrollView>

      <EditWardModal
        visible={editingWard !== null}
        ward={editingWard}
        onClose={() => setEditingWardId(null)}
        onSave={handleSaveWard}
      />
      <TourOverlay screen="WardManagement" />
    </SafeAreaView>
  );
}
