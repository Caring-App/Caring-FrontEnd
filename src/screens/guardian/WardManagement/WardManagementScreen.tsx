import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/ui';
import { MOCK_WARDS, Ward } from '@features/ward-management/model';
import { EditWardModal, WardCard } from '@features/ward-management/ui';

export function WardManagementScreen() {
  const [wards, setWards] = useState<Ward[]>(MOCK_WARDS);
  const [editingWardId, setEditingWardId] = useState<string | null>(null);

  const editingWard = wards.find(ward => ward.id === editingWardId) ?? null;

  function updateWard(id: string, patch: Partial<Ward>) {
    setWards(prev => prev.map(ward => (ward.id === id ? { ...ward, ...patch } : ward)));
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <AppHeader />
      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}>
        <View className="mt-4 rounded-card border border-border bg-surface p-4">
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
    </SafeAreaView>
  );
}
