import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export interface TimePickerProps {
  label: string;
  hour: string;
  minute: string;
  amPm: 'AM' | 'PM';
  onHourChange: (val: string) => void;
  onMinuteChange: (val: string) => void;
  onAmPmChange: (val: 'AM' | 'PM') => void;
}

export const TimePickerSection = (props: TimePickerProps) => {
  // 01~12 시간 배열 생성
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  // 00~59 분 배열 생성
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#111111' }}>{props.label}</Text>
      
      {/* 전체 피커 박스 배경을 완전한 흰색(#ffffff)으로 지정 */}
      <View style={{ flexDirection: 'row', height: 150, borderWidth: 1, borderColor: '#dee2e6', borderRadius: 10, overflow: 'hidden', backgroundColor: '#ffffff' }}>
        
        {/* 오전/오후 선택 */}
        <View style={{ flex: 1, borderRightWidth: 1, borderColor: '#dee2e6', backgroundColor: '#ffffff' }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {['AM', 'PM'].map(item => (
              <TouchableOpacity key={item} onPress={() => props.onAmPmChange(item as 'AM' | 'PM')} style={{ padding: 15, alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', color: props.amPm === item ? '#FD7E14' : '#404446', fontWeight: props.amPm === item ? 'bold' : 'normal' }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 시간 스크롤 */}
        <View style={{ flex: 1, borderRightWidth: 1, borderColor: '#dee2e6', backgroundColor: '#ffffff' }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {hours.map(h => (
              <TouchableOpacity key={h} onPress={() => props.onHourChange(h)} style={{ padding: 15, alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', color: props.hour === h ? '#FD7E14' : '#404446', fontWeight: props.hour === h ? 'bold' : 'normal' }}>{h}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 분 스크롤 */}
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {minutes.map(m => (
              <TouchableOpacity key={m} onPress={() => props.onMinuteChange(m)} style={{ padding: 15, alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', color: props.minute === m ? '#FD7E14' : '#404446', fontWeight: props.minute === m ? 'bold' : 'normal' }}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </View>
    </View>
  );
};