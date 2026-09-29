import React from 'react';
import { Pressable, View } from 'react-native';
// 어르신 글자 크기 배율은 ward-management가 유일한 소스라 WardText를 그대로 가져다 씀(순환참조 없음)
import { WardText } from '@features/ward-management/ui';
import type { StepsAccessStatus } from '../utils/healthConnect';

const NOTICE_TEXT: Record<Exclude<StepsAccessStatus, 'granted'>, { message: string; button: string }> = {
  denied: {
    message: '걸음 수를 보호자님께 보내려면 걸음 수 권한을 허용해 주세요.',
    button: '권한 허용하기',
  },
  unavailable: {
    message: '걸음 수를 보호자님께 보내려면 Health Connect 앱이 필요해요.',
    button: 'Health Connect 설치하기',
  },
};

// 어르신 홈 — 걸음 수를 읽을 수 없을 때만 보이는 안내. 조용히 건너뛰면 보호자 화면에 "기록 없음"만 떠서 원인을 알 수 없었음
export function StepSyncNotice({ status, onPressFix }: { status: StepsAccessStatus | null; onPressFix: () => void }) {
  if (status === null || status === 'granted') return null;
  const { message, button } = NOTICE_TEXT[status];

  return (
    <View className="rounded-card border border-border bg-surface p-4">
      <WardText size="md" className="font-pretendard-medium text-text-primary">
        {message}
      </WardText>
      <Pressable onPress={onPressFix} className="mt-3 items-center justify-center rounded-card bg-primary py-3">
        <WardText size="md" className="font-pretendard-semibold text-white">
          {button}
        </WardText>
      </Pressable>
    </View>
  );
}
