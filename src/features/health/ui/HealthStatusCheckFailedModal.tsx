import React from 'react';
import { Modal, Pressable, View } from 'react-native';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, 어르신 글자 크기 배율은
// ward-management가 유일한 소스라(useWardFontScaleStore) WardText를 그대로 가져다 씀.
import { WardText } from '@features/ward-management/ui';

interface HealthStatusCheckFailedModalProps {
  // 서버가 준 실패 사유(예: 마감 시간 이후 "지금은 상태를 수정할 수 없습니다."), null이면 닫힘
  message: string | null;
  onClose: () => void;
}

// 어르신이 오늘의 건강 상태를 눌렀는데 기록에 실패했을 때 이유를 알려주는 안내 모달.
// 알림 없이 이모지만 원래대로 되돌아가면 어르신이 왜 안 되는지 알 수 없어서 추가함.
// 공용 ConfirmModal은 버튼이 두 개이고 글자 크기 배율(WardText)이 적용되지 않아 따로 둠(스타일은 동일하게 맞춤).
export function HealthStatusCheckFailedModal({ message, onClose }: HealthStatusCheckFailedModalProps) {
  return (
    <Modal visible={message !== null} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/30 px-5" onPress={onClose}>
        <Pressable className="w-full rounded-card border border-border bg-surface px-4 pb-6 pt-6" onPress={() => {}}>
          <WardText size="xl" className="font-pretendard-bold text-text-primary">
            건강 상태를 기록하지 못했어요
          </WardText>
          <WardText size="md" className="mt-2 font-pretendard-medium text-text-muted">
            {message}
          </WardText>

          <View className="mt-6">
            <Pressable className="items-center justify-center rounded-[8px] bg-primary py-4" onPress={onClose}>
              <WardText size="2xl" className="font-pretendard-semibold text-surface">
                확인
              </WardText>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
