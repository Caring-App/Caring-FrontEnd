import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import RssIcon from '@assets/icons/action/rss.svg';
import CloseXIcon from '@assets/icons/action/close-x.svg';

export function LinkCodeModal({
  visible,
  name,
  code,
  onClose,
}: {
  visible: boolean;
  name: string;
  code: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onShow={() => setCopied(false)}>
      <Pressable className="flex-1 items-center justify-center bg-black/30 px-4" onPress={onClose}>
        <Pressable className="w-full max-w-[375px] rounded-card bg-surface p-4" onPress={() => {}}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <RssIcon width={18} height={18} />
              <Text className="text-xl font-pretendard-bold text-text-primary">
                {name} 고유 연동 코드
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <CloseXIcon width={20} height={20} />
            </Pressable>
          </View>

          <Text className="mt-2 text-center text-xs font-pretendard-medium text-text-muted">
            돌봄대상자와의 안전한 연결을 위해 아래 코드를 복사하여 전달해 주세요.
          </Text>

          <View className="mt-4 items-center gap-3 rounded-card border border-border p-4">
            <Text className="text-lg font-pretendard-semibold text-text-body">연동 코드</Text>
            <View className="w-full items-center rounded-[6px] border border-border-input py-2">
              <Text className="text-lg font-pretendard-semibold text-text-body">{code}</Text>
            </View>
            {/* TODO: 클립보드 라이브러리(@react-native-clipboard/clipboard) 도입 후 실제 복사 연동 */}
            <Pressable
              className="items-center justify-center rounded-[8px] bg-primary px-4 py-1.5"
              onPress={() => setCopied(true)}>
              <Text className="text-sm font-pretendard-semibold text-surface">
                {copied ? '복사됨' : '복사'}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
