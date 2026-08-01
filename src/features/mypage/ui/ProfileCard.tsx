import React from 'react';
import { Pressable, Text, View } from 'react-native';
import UserIcon from '@assets/icons/under_nav/mypage.svg';
import PencilLineIcon from '@assets/icons/action/pencil-line.svg';
import ChevronRightOrangeIcon from '@assets/icons/action/chevron-right-orange.svg';
import { ProfileInfo } from '../model';

export function ProfileCard({
  profile,
  onPressEditInfo,
  onPressLinkCode,
}: {
  profile: ProfileInfo;
  onPressEditInfo: () => void;
  onPressLinkCode: () => void;
}) {
  return (
    <View className="rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <View className="h-[30px] w-[30px] items-center justify-center rounded-full bg-avatar">
          <UserIcon width={18} height={18} />
        </View>
        <Text className="text-xl font-pretendard-bold text-text-primary">{profile.name}</Text>
      </View>

      <View className="my-3 h-px bg-border-divider" />

      <Pressable className="flex-row items-center gap-2 py-1" onPress={onPressEditInfo} hitSlop={8}>
        <PencilLineIcon width={16} height={16} />
        <Text className="text-xl font-pretendard-semibold text-text-primary">개인 정보 수정</Text>
      </Pressable>

      <Pressable className="mt-3 flex-row items-center gap-1 py-1" onPress={onPressLinkCode} hitSlop={8}>
        <ChevronRightOrangeIcon width={16} height={16} />
        <Text className="text-xl font-pretendard-semibold text-text-primary">연동 코드 확인</Text>
      </Pressable>
    </View>
  );
}
