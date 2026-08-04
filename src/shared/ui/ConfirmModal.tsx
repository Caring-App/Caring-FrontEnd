import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  visible,
  title,
  subtitle,
  cancelLabel = '취소',
  confirmLabel = '삭제',
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable className="flex-1 items-center justify-center bg-black/30 px-5" onPress={onCancel}>
        <Pressable className="w-full rounded-card border border-border bg-surface px-4 pb-6 pt-6" onPress={() => {}}>
          <Text className="text-xl font-pretendard-bold text-text-primary">{title}</Text>
          {subtitle && <Text className="mt-2 text-xs font-pretendard-medium text-text-muted">{subtitle}</Text>}

          <View className="mt-6 flex-row gap-4">
            <Pressable
              className="flex-1 items-center justify-center rounded-[8px] bg-buttonMuted py-4"
              onPress={onCancel}>
              <Text className="text-2xl font-pretendard-semibold text-surface">{cancelLabel}</Text>
            </Pressable>
            <Pressable className="flex-1 items-center justify-center rounded-[8px] bg-primary py-4" onPress={onConfirm}>
              <Text className="text-2xl font-pretendard-semibold text-surface">{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
