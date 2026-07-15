import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../../../styles/MonitorStyles';
import { PillItem } from '../../../types/medication';

interface Props {
  pill: PillItem;
  onToggle: (id: string) => void;
}

export const PillButton = ({ pill, onToggle }: Props) => (
  <TouchableOpacity
    style={[styles.pillButton, pill.status === 'done' ? styles.btnDone : styles.btnPending]}
    onPress={() => onToggle(pill.id)}
  >
    <Text style={styles.nameText}>{pill.name}</Text>
    <Text style={styles.statusText}>
      {pill.status === 'done' ? '✅ 완료' : '⭕ 미완료'}
    </Text>
  </TouchableOpacity>
);