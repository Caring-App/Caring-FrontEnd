import React from 'react';
import { Modal, Pressable, View } from 'react-native';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, 어르신 글자 크기 배율은
// ward-management가 유일한 소스라(useWardFontScaleStore) WardText를 그대로 가져다 씀.
import { WardText } from '@features/ward-management/ui';

interface WardNoticeModalProps {
  title: string;
  // 안내 내용(예: 기록 실패 사유, 저장 완료 안내), null이면 닫힘
  message: string | null;
  onClose: () => void;
}

// 어르신 화면용 확인 버튼 하나짜리 안내 모달 — 기분 기록 실패 사유, 건강 수치 저장 완료 등.
// 알림 없이 조용히 끝나면 어르신이 됐는지 안 됐는지 알 수 없어서 씀.
// 공용 ConfirmModal은 버튼이 두 개이고 글자 크기 배율(WardText)이 적용되지 않아 따로 둠(스타일은 동일하게 맞춤).
export function WardNoticeModal({ title, message, onClose }: WardNoticeModalProps) {
  return (
    <Modal visible={message !== null} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/30 px-5" onPress={onClose}>
        <Pressable className="w-full rounded-card border border-border bg-surface px-4 pb-6 pt-6" onPress={() => {}}>
          <WardText size="xl" className="font-pretendard-bold text-text-primary">
            {title}
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
