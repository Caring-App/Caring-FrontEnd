import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import { AppHeader } from '@shared/ui';
import { useGuardianMenuStore } from '@features/guardian-menu/model';
import { useTourStore } from '@features/guardian-tour/model';
import { TourOverlay, TourTarget } from '@features/guardian-tour/ui';
import { MOCK_WARDS, Ward } from '@features/ward-management/model';
import { EditWardModal, WardCard } from '@features/ward-management/ui';

type GuardianStackNavigationProp = NativeStackNavigationProp<GuardianStackParamList>;

export function WardManagementScreen() {
  const navigation = useNavigation();
  const stackNavigation = navigation.getParent<GuardianStackNavigationProp>();
  const [wards, setWards] = useState<Ward[]>(MOCK_WARDS);
  const [editingWardId, setEditingWardId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    useTourStore.getState().registerScrollRef('wardManagement', scrollViewRef);
  }, []);

  const editingWard = wards.find(ward => ward.id === editingWardId) ?? null;

  function updateWard(id: string, patch: Partial<Ward>) {
    setWards(prev => prev.map(ward => (ward.id === id ? { ...ward, ...patch } : ward)));
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <AppHeader
        onPressBell={() => stackNavigation?.navigate('Notification')}
        onPressMenu={() => useGuardianMenuStore.getState().open()}
      />
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={event => useTourStore.getState().setScrollOffset('wardManagement', event.nativeEvent.contentOffset.y)}
        onMomentumScrollEnd={() => useTourStore.getState().notifyScrollSettled()}>
        <TourTarget id="wardManagement.section" className="mt-4">
          <View className="rounded-card border border-border bg-surface p-4">
            <Text className="text-xl font-pretendard-bold text-text-primary">돌봄대상자 관리</Text>
            <View className="mt-4 gap-4">
              {wards.map(ward => (
                <WardCard
                  key={ward.id}
                  ward={ward}
                  onChangeTtsSpeed={speed => updateWard(ward.id, { ttsSpeed: speed })}
                  onChangeFontSize={size => updateWard(ward.id, { fontSize: size })}
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
        onSave={info => {
          if (editingWard) updateWard(editingWard.id, info);
          setEditingWardId(null);
        }}
      />
      <TourOverlay screen="WardManagement" />
    </SafeAreaView>
  );
}
