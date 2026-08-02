import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { MedicationStatus } from '../types/senior';

// 복약 SVG 아이콘 import
import CapsuleOnIcon from '@assets/icons/medication/capsule-on.svg';
import CapsuleOffIcon from '@assets/icons/medication/capsule-off.svg';
import PillIcon from '@assets/icons/section/prescription2.svg';

interface MedicationCardProps {
  status: MedicationStatus;
  onToggleMedication: (time: keyof MedicationStatus) => void;
}

export const MedicationCard = ({ status, onToggleMedication }: MedicationCardProps) => {
  return (
    <View className="bg-white rounded-2xl border border-gray-200 p-4 mb-5 shadow-sm">
      <View className="flex-row items-center mb-4">
        <PillIcon width={24} height={24} style={{ marginRight: 8 }} />
        <Text className="text-lg font-bold text-gray-900">복약 관리</Text>
      </View>

      <View className="bg-gray-50 rounded-xl border border-gray-100 p-4">
        <View className="flex-row justify-around items-center">
          {/* 아침 복약 버튼 */}
          <Pressable 
            onPress={() => onToggleMedication('morning')} 
            className="items-center active:opacity-70"
          >
            <Text className="text-sm font-bold text-gray-700 mb-2">아침</Text>
            {status?.morning ? (
              <CapsuleOnIcon width={40} height={40} />
            ) : (
              <CapsuleOffIcon width={40} height={40} />
            )}
          </Pressable>

          {/* 점심 복약 버튼 */}
          <Pressable 
            onPress={() => onToggleMedication('lunch')} 
            className="items-center active:opacity-70"
          >
            <Text className="text-sm font-bold text-gray-700 mb-2">점심</Text>
            {status?.lunch ? (
              <CapsuleOnIcon width={40} height={40} />
            ) : (
              <CapsuleOffIcon width={40} height={40} />
            )}
          </Pressable>

          {/* 저녁 복약 버튼 */}
          <Pressable 
            onPress={() => onToggleMedication('dinner')} 
            className="items-center active:opacity-70"
          >
            <Text className="text-sm font-bold text-gray-700 mb-2">저녁</Text>
            {status?.dinner ? (
              <CapsuleOnIcon width={40} height={40} />
            ) : (
              <CapsuleOffIcon width={40} height={40} />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};