import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Toggle } from '@shared/ui';
import CapsuleIcon from '@assets/icons/medication/capsule-on.svg';
import EditIcon from '@assets/icons/action/edit-pencil.svg';
import { MedicationEntry } from '../model/medicationTypes';
import { MEAL_TYPE_LABELS, formatDays, formatMedicationTime } from '../utils';

interface MedicationListItemProps {
  entry: MedicationEntry;
  onEdit: () => void;
  onToggleEnabled: () => void;
}

export function MedicationListItem({ entry, onEdit, onToggleEnabled }: MedicationListItemProps) {
  return (
    <View className="rounded-card border border-border bg-surface px-4 py-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <CapsuleIcon width={16} height={15} />
          <Text className="font-pretendard-semibold text-xl text-text-primary">
            {MEAL_TYPE_LABELS[entry.mealType]} 약
          </Text>
        </View>
        <Pressable onPress={onEdit} hitSlop={8}>
          <EditIcon width={19} height={17} />
        </Pressable>
      </View>
      <View className="mt-2 flex-row items-center justify-between">
        <View className="flex-row items-baseline gap-2">
          <Text className="font-pretendard-semibold text-text-primary" style={styles.time}>
            {formatMedicationTime(entry.time)}
          </Text>
          <Text className="font-pretendard-medium text-base text-text-muted">{formatDays(entry.days)}</Text>
        </View>
        <Toggle value={entry.enabled} onValueChange={onToggleEnabled} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  time: { fontSize: 26, letterSpacing: -0.65 },
});
