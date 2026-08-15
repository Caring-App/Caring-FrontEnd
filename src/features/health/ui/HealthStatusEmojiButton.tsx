import React from 'react';
import { Pressable } from 'react-native';
import { HealthStatus } from '../model';
import EmojiSmileOnIcon from '@assets/icons/emoji/emoji-smile-on.svg';
import EmojiSmileOffIcon from '@assets/icons/emoji/emoji-smile-off.svg';
import EmojiNeutralOnIcon from '@assets/icons/emoji/emoji-neutral-on.svg';
import EmojiNeutralOffIcon from '@assets/icons/emoji/emoji-neutral-off.svg';
import EmojiTearOnIcon from '@assets/icons/emoji/emoji-tear-on.svg';
import EmojiTearOffIcon from '@assets/icons/emoji/emoji-tear-off.svg';

export const HEALTH_STATUS_EMOJI_ICONS: Record<HealthStatus, { on: typeof EmojiSmileOnIcon; off: typeof EmojiSmileOnIcon }> = {
  good: { on: EmojiSmileOnIcon, off: EmojiSmileOffIcon },
  normal: { on: EmojiNeutralOnIcon, off: EmojiNeutralOffIcon },
  bad: { on: EmojiTearOnIcon, off: EmojiTearOffIcon },
};

interface HealthStatusEmojiButtonProps {
  status: HealthStatus;
  active: boolean;
  onPress?: () => void;
}

// 건강 상태 이모지 버튼 하나. 보호자 화면(DailyReportCard)에서는 onPress 없이 읽기 전용으로 보여주고,
// 돌봄대상자 화면(WardHealthStatusCard)에서는 onPress로 실제 상태를 기록하는 데 같이 씀
export function HealthStatusEmojiButton({ status, active, onPress }: HealthStatusEmojiButtonProps) {
  const { on: OnIcon, off: OffIcon } = HEALTH_STATUS_EMOJI_ICONS[status];
  const Icon = active ? OnIcon : OffIcon;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="h-[85px] w-[85px] items-center justify-center rounded-card bg-surface">
      <Icon width={60} height={60} />
    </Pressable>
  );
}
