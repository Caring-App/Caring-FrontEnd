import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { EmotionType } from '../types/senior';

import EmojiSmileOnIcon from '@assets/icons/emoji/emoji-smile-on.svg';
import EmojiSmileOffIcon from '@assets/icons/emoji/emoji-smile-off.svg';
import EmojiNeutralOnIcon from '@assets/icons/emoji/emoji-neutral-on.svg';
import EmojiNeutralOffIcon from '@assets/icons/emoji/emoji-neutral-off.svg';
import EmojiTearOnIcon from '@assets/icons/emoji/emoji-tear-on.svg';
import EmojiTearOffIcon from '@assets/icons/emoji/emoji-tear-off.svg';
import HeartIcon from '@assets/icons/section/clipboard-pulse.svg';

interface HealthStatusCardProps {
  selectedEmotion: EmotionType;
  onSelectEmotion: (emotion: EmotionType) => void;
  onRecord: () => void;
}

export const HealthStatusCard = ({
  selectedEmotion,
  onSelectEmotion,
  onRecord,
}: HealthStatusCardProps) => {
  return (
    <View className="bg-white rounded-2xl border border-gray-200 p-4 mb-5 shadow-sm">
      <View className="flex-row items-center mb-4">
        <HeartIcon width={24} height={24} style={{ marginRight: 8 }} />
        <Text className="text-lg font-bold text-gray-900">오늘의 건강 상태</Text>
      </View>

      <View className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-3">
        <View className="flex-row justify-around items-center">
          {/* 기쁨/좋음 */}
          <Pressable onPress={() => onSelectEmotion('happy')}>
            {selectedEmotion === 'happy' ? (
              <EmojiSmileOnIcon width={56} height={56} />
            ) : (
              <EmojiSmileOffIcon width={56} height={56} />
            )}
          </Pressable>

          {/* 보통 */}
          <Pressable onPress={() => onSelectEmotion('neutral')}>
            {selectedEmotion === 'neutral' ? (
              <EmojiNeutralOnIcon width={56} height={56} />
            ) : (
              <EmojiNeutralOffIcon width={56} height={56} />
            )}
          </Pressable>

          {/* 슬픔/아픔 */}
          <Pressable onPress={() => onSelectEmotion('sad')}>
            {selectedEmotion === 'sad' ? (
              <EmojiTearOnIcon width={56} height={56} />
            ) : (
              <EmojiTearOffIcon width={56} height={56} />
            )}
          </Pressable>
        </View>
      </View>

      {/* 오늘의 건강 기록하기 버튼 */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onRecord}
        className="bg-primary rounded-xl py-3.5 items-center"
      >
        <Text className="text-white font-bold text-base">오늘의 건강 기록하기</Text>
      </TouchableOpacity>
    </View>
  );
};