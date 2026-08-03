import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { WHEEL_HEIGHT, WHEEL_ITEM_HEIGHT, WheelColumn } from './WheelColumn';

const YEAR_RANGE = 6;

interface MonthYearPickerModalProps {
  visible: boolean;
  year: number;
  month: number;
  onClose: () => void;
  onConfirm: (year: number, month: number) => void;
}

export function MonthYearPickerModal({ visible, year, month, onClose, onConfirm }: MonthYearPickerModalProps) {
  const [selectedYear, setSelectedYear] = useState(String(year));
  const [selectedMonth, setSelectedMonth] = useState(String(month));

  const years = React.useMemo(
    () => Array.from({ length: YEAR_RANGE * 2 + 1 }, (_, i) => String(year - YEAR_RANGE + i)),
    [year],
  );
  const months = React.useMemo(() => Array.from({ length: 12 }, (_, i) => String(i + 1)), []);

  const handleConfirm = () => {
    onConfirm(Number(selectedYear), Number(selectedMonth));
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/30 px-8">
        <View className="w-full rounded-card border border-border bg-surface p-4">
          <Text className="mb-4 text-center font-pretendard-bold text-lg text-text-primary">연도/월 선택</Text>

          <View
            style={{ height: WHEEL_HEIGHT }}
            className="relative flex-row items-center justify-center rounded-xl border border-border-divider bg-white">
            <View
              pointerEvents="none"
              className="absolute left-3 right-3 border-t border-wheel-divider"
              style={{ top: WHEEL_ITEM_HEIGHT }}
            />
            <View
              pointerEvents="none"
              className="absolute left-3 right-3 border-b border-wheel-divider"
              style={{ top: WHEEL_ITEM_HEIGHT * 2 }}
            />
            <WheelColumn values={years} selectedValue={selectedYear} width={42} onChange={setSelectedYear} />
            <Text style={{ marginLeft: 3 }} className="font-pretendard-semibold text-md text-wheel-active">
              년
            </Text>
            <View style={{ marginLeft: 14 }}>
              <WheelColumn values={months} selectedValue={selectedMonth} width={20} onChange={setSelectedMonth} />
            </View>
            <Text style={{ marginLeft: 3 }} className="font-pretendard-semibold text-md text-wheel-active">
              월
            </Text>
          </View>

          <View className="mt-4 flex-row gap-2">
            <Pressable
              onPress={onClose}
              className="flex-1 items-center justify-center rounded-md border border-border-input py-3">
              <Text className="font-pretendard-semibold text-md text-text-body">취소</Text>
            </Pressable>
            <Pressable onPress={handleConfirm} className="flex-1 items-center justify-center rounded-md bg-primary py-3">
              <Text className="font-pretendard-semibold text-md text-white">확인</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
