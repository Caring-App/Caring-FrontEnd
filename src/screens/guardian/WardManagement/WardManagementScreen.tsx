import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import { AppHeader } from '@shared/ui';
import { useGuardianMenuStore } from '@features/guardian-menu/model';
import { useTourScrollTracking } from '@features/guardian-tour/model';
import { TourOverlay, TourTarget } from '@features/guardian-tour/ui';
import { WardInfo, useSelectedWardStore, useWardManagement } from '@features/ward-management/model';
import { EditWardModal, WardCard } from '@features/ward-management/ui';

type GuardianStackNavigationProp = NativeStackNavigationProp<GuardianStackParamList>;

export function WardManagementScreen() {
  const navigation = useNavigation();
  const stackNavigation = navigation.getParent<GuardianStackNavigationProp>();
  const { wards, saveWardInfo, saveWardSetting } = useWardManagement();
  const [editingWardId, setEditingWardId] = useState<string | null>(null);
  const tourScroll = useTourScrollTracking('wardManagement');

  const editingWard = wards.find(ward => ward.id === editingWardId) ?? null;

  async function handleSaveWard(info: WardInfo) {
    if (!editingWard) return;
    const success = await saveWardInfo(editingWard.id, info);
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
              {wards.map(ward => (
                <WardCard
                  key={ward.id}
                  ward={ward}
                  onChangeTtsRate={rate => useSelectedWardStore.getState().updateWard(ward.id, { ttsRate: rate })}
                  onCommitTtsRate={rate => saveWardSetting(ward.id, { ttsRate: rate })}
                  onChangeFontSize={size => {
                    useSelectedWardStore.getState().updateWard(ward.id, { fontSize: size });
                    saveWardSetting(ward.id, { fontSize: size });
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
