import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../../styles/MonitorStyles';
import { PillButton } from './PillButton';
import { useMedicationStore } from '../model/useMedicationStore';

export default function MedicationMonitor() {
  const { taken, setTaken } = useMedicationStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>복약 관리</Text>
      
      <View style={styles.row}>
        {/* 아침 버튼 */}
        <PillButton 
          pill={{ 
            id: 'morning', 
            name: '아침', 
            status: taken.morning ? 'done' : 'pending' 
          }} 
          onToggle={(id) => setTaken('morning', !taken.morning)} 
        />
        
        {/* 점심 버튼 */}
        <PillButton 
          pill={{ 
            id: 'lunch', 
            name: '점심', 
            status: taken.lunch ? 'done' : 'pending' 
          }} 
          onToggle={(id) => setTaken('lunch', !taken.lunch)} 
        />
        
        {/* 저녁 버튼 */}
        <PillButton 
          pill={{ 
            id: 'dinner', 
            name: '저녁', 
            status: taken.dinner ? 'done' : 'pending' 
          }} 
          onToggle={(id) => setTaken('dinner', !taken.dinner)} 
        />
      </View>
    </View>
  );
}