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
import { MOCK_WARDS, Ward } from '@features/ward-management/model';
import { EditWardModal, WardCard } from '@features/ward-management/ui';

type GuardianStackNavigationProp = NativeStackNavigationProp<GuardianStackParamList>;

// TODO: 백엔드 연동(GET/PATCH /api/connection) 아직 안 함 — 여기서 쓰는 mock string id('mother'/'father')가
// useSelectedWardStore를 통해 복약/건강/위치/홈 등 다른 mock 도메인 여러 개와 얽혀 있어서, 이 화면만 따로
// 실 데이터로 바꾸면 나머지가 다 깨짐. 그 도메인들 백엔드 연동이 각자 PR로 들어올 때 한꺼번에 교체 예정.
// 연동 API 자체는 @features/account-link/api (getConnectionsApi/getConnectionDetailApi/updateConnectionApi)에
// 이미 준비되어 있음 — EditWardModal의 저장 필드(nickname/name/phone/address)는 PATCH 바디와 1:1로 맞음.
export function WardManagementScreen() {
  const navigation = useNavigation();
  const stackNavigation = navigation.getParent<GuardianStackNavigationProp>();
  const [wards, setWards] = useState<Ward[]>(MOCK_WARDS);
  const [editingWardId, setEditingWardId] = useState<string | null>(null);
  const tourScroll = useTourScrollTracking('wardManagement');

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
