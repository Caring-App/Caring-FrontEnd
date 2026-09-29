import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { formatReportTimeLabel } from '../utils/reportUtils';

// 값은 'HH:mm'(레포트 시각 API 형식), 화면에는 'HH : mm'으로 표시. 백엔드 스케줄러가 분 단위로 돌아서 정시만 고르게 함
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`);

export interface DropdownAnchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function TimeDropdown({
  visible,
  value,
  anchor,
  onClose,
  onSelect,
}: {
  visible: boolean;
  value: string;
  anchor: DropdownAnchor | null;
  onClose: () => void;
  onSelect: (time: string) => void;
}) {
  if (!anchor) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1" onPress={onClose}>
        <View
          className="absolute overflow-hidden rounded-[8px] border border-border bg-surface shadow-modal"
          style={{ top: anchor.y + anchor.height + 4, left: anchor.x, width: anchor.width, maxHeight: 180 }}>
          <ScrollView showsVerticalScrollIndicator nestedScrollEnabled>
            {HOUR_OPTIONS.map(time => (
              <Pressable
                key={time}
                className={`px-3 py-2 ${time === value ? 'bg-primary-50' : ''}`}
                onPress={() => {
                  onSelect(time);
                  onClose();
                }}>
                <Text
                  className={`text-xs ${
                    time === value ? 'font-pretendard-semibold text-primary' : 'text-text-primary'
                  }`}>
                  {formatReportTimeLabel(time)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}
