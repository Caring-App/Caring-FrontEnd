import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { FONT_SIZES } from '@shared/theme/typography';
import type { Notice, NoticeButton } from '@shared/model/useNoticeStore';

interface NoticeModalProps {
  notice: Notice | null;
  onDismiss: (button?: NoticeButton) => void;
  // 어르신 화면 글자 크기 배율 — 보호자 화면은 1
  textScale?: number;
}

// 앱 공용 안내·에러 모달 (ConfirmModal·로그아웃 확인 모달과 같은 스타일).
// 버튼이 하나면 꽉 찬 주황 버튼, 둘 이상이면 가로로 나란히(취소는 회색)
export function NoticeModal({
  notice,
  onDismiss,
  textScale = 1,
}: NoticeModalProps) {
  const fontSize = (token: keyof typeof FONT_SIZES) =>
    FONT_SIZES[token].size * textScale;
  // 확인 버튼 하나짜리는 바깥을 눌러도 닫히게, 선택이 필요한 안내(버튼 둘 이상)는 버튼으로만 닫히게 함
  const canDismissOutside = !!notice && notice.buttons.length === 1;

  return (
    <Modal
      visible={!!notice}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => canDismissOutside && onDismiss()}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/30 px-5"
        onPress={() => canDismissOutside && onDismiss()}
      >
        <Pressable
          className="w-full max-w-[375px] rounded-card border border-border bg-surface px-4 pb-6 pt-6"
          onPress={() => {}}
        >
          {notice && (
            <>
              <Text
                className="font-pretendard-bold text-text-primary"
                style={{ fontSize: fontSize('xl') }}
              >
                {notice.title}
              </Text>
              {!!notice.message && (
                <Text
                  className="mt-2 font-pretendard-medium text-text-muted"
                  style={{ fontSize: fontSize('base') }}
                >
                  {notice.message}
                </Text>
              )}

              <View className="mt-6 flex-row gap-4">
                {notice.buttons.map(button => (
                  <Pressable
                    key={button.text}
                    className={`flex-1 items-center justify-center rounded-[8px] py-4 ${
                      button.style === 'cancel'
                        ? 'bg-buttonMuted'
                        : 'bg-primary'
                    }`}
                    onPress={() => onDismiss(button)}
                  >
                    <Text
                      className="font-pretendard-semibold text-surface"
                      style={{ fontSize: fontSize('2xl') }}
                    >
                      {button.text}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
