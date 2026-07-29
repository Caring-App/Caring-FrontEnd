import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSessionStore } from '@shared/store/useSessionStore';

export function LogoutConfirmModal() {
  const visible = useSessionStore(state => state.isLogoutConfirmVisible);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => useSessionStore.getState().cancelLogout()}>
      <Pressable
        className="flex-1 items-center justify-center bg-black/30 px-4"
        onPress={() => useSessionStore.getState().cancelLogout()}>
        <Pressable
          className="w-full max-w-[375px] rounded-card border border-border bg-surface p-4"
          onPress={() => {}}>
          <Text className="text-xl font-pretendard-bold text-text-primary">로그아웃 하시겠어요?</Text>
          <Text className="mt-2 text-xs font-pretendard-medium text-text-muted">
            언제든지 다시 로그인하실 수 있어요.
          </Text>

          <View className="mt-6 flex-row gap-4">
            <Pressable
              className="flex-1 items-center justify-center rounded-[8px] bg-buttonMuted py-4"
              onPress={() => useSessionStore.getState().cancelLogout()}>
              <Text className="text-2xl font-pretendard-semibold text-surface">취소</Text>
            </Pressable>
            <Pressable
              className="flex-1 items-center justify-center rounded-[8px] bg-primary py-4"
              onPress={() => useSessionStore.getState().logout()}>
              <Text className="text-2xl font-pretendard-semibold text-surface">로그아웃</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
