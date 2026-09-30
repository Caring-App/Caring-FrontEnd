import React from 'react';
import { Pressable, Text, View } from 'react-native';

// 연동된 돌봄대상자가 한 명도 없을 때 보호자 화면에 보여주는 안내.
// 목업 어르신은 사용 가이드(투어) 중에만 보여주고, 평소엔 가짜 정보 대신 이 안내를 띄움
export function NoLinkedWardNotice({ onPressLinkCode }: { onPressLinkCode?: () => void }) {
  return (
    <View className="items-center gap-2 rounded-card border border-border px-4 py-8">
      <Text className="text-lg font-pretendard-bold text-text-primary">연동된 돌봄대상자가 없어요</Text>
      <Text className="text-center text-md font-pretendard-medium text-text-muted">
        돌봄대상자 앱에서 보호자님의 연동 코드를 입력하면{'\n'}이곳에 돌봄대상자 정보가 표시돼요.
      </Text>
      {onPressLinkCode && (
        <Pressable className="mt-2 rounded-[8px] bg-primary px-4 py-2" onPress={onPressLinkCode}>
          <Text className="text-md font-pretendard-semibold text-surface">마이페이지에서 연동 코드 확인</Text>
        </Pressable>
      )}
    </View>
  );
}
