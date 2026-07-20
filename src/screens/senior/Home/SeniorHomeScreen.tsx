import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SeniorMedicationSlot } from '../components/SeniorMedicationSlot';
import { HealthRecordModal } from '../components/HealthRecordModal';
import { useSeniorHome } from '../hooks/useSeniorHome';
import EmojiSmileOnIcon from '@assets/icons/emoji/emoji-smile-on.svg';
import CalendarEventIcon from '@assets/icons/section/calendar-event.svg';
import PrescriptionIcon from '@assets/icons/section/prescription2.svg';

export function SeniorHomeScreen() {
  const { handleLogout } = useSeniorHome();
  
  const [isHealthModalVisible, setIsHealthModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState<'good' | 'normal' | 'bad'>('good');

  const handleSaveHealthData = (data: { bloodSugar: string; bloodPressure: string; weight: string }) => {
    console.log("저장된 건강 데이터:", { selectedMood, ...data });
    setIsHealthModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* 상단 헤더 */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'white' }}>
          <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#FFEDD5' }}>
            <Text style={{ fontWeight: 'bold', color: '#C2410C' }}>Caring</Text>
          </View>
          <TouchableOpacity 
            onPress={handleLogout}
            style={{ borderRadius: 8, backgroundColor: '#FF7F00', paddingHorizontal: 16, paddingVertical: 8 }}
          >
            <Text style={{ fontWeight: 'bold', color: 'white' }}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: 16 }} showsVerticalScrollIndicator={false}>
          {/* 1. 오늘의 건강 상태 카드 */}
          <View style={{ marginBottom: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: 'white', padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>오늘의 건강 상태</Text>
            
            <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
              <TouchableOpacity 
                onPress={() => setSelectedMood('good')}
                style={{ width: 65, height: 65, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: selectedMood === 'good' ? '#FF7F00' : '#E5E7EB', backgroundColor: selectedMood === 'good' ? '#FFEDD5' : 'white' }}
              >
                <EmojiSmileOnIcon width={38} height={38} />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setSelectedMood('normal')}
                style={{ width: 65, height: 65, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: selectedMood === 'normal' ? '#FF7F00' : '#E5E7EB', backgroundColor: selectedMood === 'normal' ? '#FFEDD5' : 'white' }}
              >
                <EmojiSmileOnIcon width={38} height={38} />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setSelectedMood('bad')}
                style={{ width: 65, height: 65, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: selectedMood === 'bad' ? '#FF7F00' : '#E5E7EB', backgroundColor: selectedMood === 'bad' ? '#FFEDD5' : 'white' }}
              >
                <EmojiSmileOnIcon width={38} height={38} />
              </TouchableOpacity>
            </View>

            {/* 오늘의 건강 기록하기 버튼 */}
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => {
                console.log("모달 열기 버튼 클릭됨");
                setIsHealthModalVisible(true);
              }}
              style={{ marginTop: 16, height: 48, backgroundColor: '#FF7F00', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>오늘의 건강 기록하기</Text>
            </TouchableOpacity>
          </View>

          {/* 2. 일정 관리 카드 */}
          <View style={{ marginBottom: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: 'white', padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <CalendarEventIcon width={20} height={20} />
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>일정 관리</Text>
            </View>
            <View style={{ marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', padding: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>오늘의 일정</Text>
              <Text style={{ marginTop: 4, fontSize: 12, color: '#6B7280' }}>등록된 일정이 없습니다.</Text>
            </View>
            <TouchableOpacity style={{ marginTop: 12, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#FF7F00' }}>
              <Text style={{ fontWeight: 'bold', color: 'white' }}>일정 다시 듣기 (TTS)</Text>
            </TouchableOpacity>
          </View>

          {/* 3. 복약 관리 카드 */}
          <View style={{ marginBottom: 32, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: 'white', padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <PrescriptionIcon width={20} height={20} />
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>복약 관리</Text>
            </View>
            <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-around' }}>
              <SeniorMedicationSlot label="아침" slot="morning" />
              <SeniorMedicationSlot label="점심" slot="lunch" />
              <SeniorMedicationSlot label="저녁" slot="dinner" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* 분리한 건강 기록 모달 컴포넌트 연결 */}
      <HealthRecordModal 
        visible={isHealthModalVisible}
        onClose={() => setIsHealthModalVisible(false)}
        onSave={handleSaveHealthData}
      />
    </View>
  );
}