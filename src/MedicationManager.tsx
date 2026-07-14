import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

// 약 정보를 위한 타입 정의
interface PillItem {
  id: string;
  name: string;
  status: 'done' | 'pending';
}

export default function MedicationMonitor() {
  // 초기 상태 설정
  const [pills, setPills] = useState<PillItem[]>([
    { id: '1', name: '아침', status: 'done' },
    { id: '2', name: '점심', status: 'pending' },
    { id: '3', name: '저녁', status: 'pending' },
  ]);

  // 버튼 클릭 시 해당 약의 상태를 반대로 토글하는 함수
  const toggleStatus = (id: string) => {
    setPills(prevPills =>
      prevPills.map(pill =>
        pill.id === id 
          ? { ...pill, status: pill.status === 'done' ? 'pending' : 'done' } 
          : pill
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💊 복약 관리</Text>
      <View style={styles.row}>
        {pills.map((pill) => (
          <TouchableOpacity
            key={pill.id}
            style={[
              styles.pillButton,
              pill.status === 'done' ? styles.btnDone : styles.btnPending
            ]}
            onPress={() => toggleStatus(pill.id)}
          >
            <Text style={styles.nameText}>{pill.name}</Text>
            <Text style={styles.statusText}>
              {pill.status === 'done' ? '✅ 완료' : '⭕ 미완료'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  pillButton: {
    width: '30%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  btnDone: { backgroundColor: '#FF7A00', borderColor: '#FF7A00' }, // 완료 시 주황색
  btnPending: { backgroundColor: '#F5F5F5', borderColor: '#DDD' },   // 미완료 시 회색
  nameText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  statusText: { fontSize: 12, marginTop: 5, color: '#333' },
});