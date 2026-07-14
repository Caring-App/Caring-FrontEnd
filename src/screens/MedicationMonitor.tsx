import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/MonitorStyles';
import { PillItem } from '../types/medication';
import { PillButton } from '../components/PillButton';

export default function MedicationMonitor() {
  const [pills, setPills] = useState<PillItem[]>([
    { id: '1', name: '아침', status: 'done' },
    { id: '2', name: '점심', status: 'pending' },
    { id: '3', name: '저녁', status: 'pending' },
  ]);

  const toggleStatus = (id: string) => {
    setPills(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'done' ? 'pending' : 'done' } : p));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💊 복약 관리</Text>
      <View style={styles.row}>
        {pills.map((pill) => (
          <PillButton key={pill.id} pill={pill} onToggle={toggleStatus} />
        ))}
      </View>
    </View>
  );
}