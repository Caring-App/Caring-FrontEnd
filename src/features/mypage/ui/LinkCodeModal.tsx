import React from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import { colors } from '@shared/theme/colors';
import RssIcon from '@assets/icons/action/rss.svg';
import CloseXIcon from '@assets/icons/action/close-x.svg';
import { useProtectorCode } from '../model';

export function LinkCodeModal({
  visible,
  name,
  onClose,
}: {
  visible: boolean;
  name: string;
  onClose: () => void;
}) {
  const { code, isLoading, hasLoadFailed, retry, copied, copy } = useProtectorCode(visible);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/30 px-4" onPress={onClose}>
        <Pressable className="w-full max-w-[375px] rounded-card bg-surface p-4" onPress={() => {}}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <RssIcon width={18} height={18} color={colors.primary} />
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
            <View className="min-h-[44px] w-full items-center justify-center rounded-[6px] border border-border-input py-2">
              {code ? (
                <Text className="text-lg font-pretendard-semibold text-text-body">{code}</Text>
              ) : isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : hasLoadFailed ? (
                <Text className="text-sm font-pretendard-medium text-text-muted">코드를 불러오지 못했어요.</Text>
              ) : null}
            </View>
            {!code && hasLoadFailed && !isLoading ? (
              <Pressable className="items-center justify-center rounded-[8px] bg-primary px-4 py-1.5" onPress={retry}>
                <Text className="text-sm font-pretendard-semibold text-surface">다시 시도</Text>
              </Pressable>
            ) : (
              <Pressable
                className={`items-center justify-center rounded-[8px] px-4 py-1.5 ${code ? 'bg-primary' : 'bg-buttonMuted'}`}
                onPress={copy}
                disabled={!code}>
                <Text className="text-sm font-pretendard-semibold text-surface">{copied ? '복사됨' : '복사'}</Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
