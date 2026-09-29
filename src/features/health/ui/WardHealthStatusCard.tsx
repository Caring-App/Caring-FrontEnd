import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getApiErrorMessage } from '@shared/api';
import { showNotice } from '@shared/model';
import ClipboardPulseIcon from '@assets/icons/section/clipboard-pulse.svg';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, 어르신 글자 크기 배율은
// ward-management가 유일한 소스라(useWardFontScaleStore) 이 화면에서도 WardText를 그대로 가져다 씀
// (순환참조 없음, ward-management는 health를 참조하지 않음).
import { WardText } from '@features/ward-management/ui';
import { HealthStatus, useHealthStatusStore } from '../model';
import { HealthStatusEmojiButton } from './HealthStatusEmojiButton';

const HEALTH_STATUS_OPTIONS: HealthStatus[] = ['good', 'normal', 'bad'];

interface WardHealthStatusCardProps {
  wardId: string;
  onPressRecord: () => void;
}

// 돌봄대상자 메인 화면의 "오늘의 건강 상태" 카드. 어르신이 직접 눌러서 오늘 상태를 기록하면
// mood-check API를 통해 보호자 화면(DailyReportCard)에 그대로 반영됨.
// "오늘의 건강 기록하기" 버튼도 같은 섹션에 속해 있어서 이 카드 안에 같이 둠(Figma 기준)
export function WardHealthStatusCard({
  wardId,
  onPressRecord,
}: WardHealthStatusCardProps) {
  const wardIdNumber = Number(wardId);
  const status = useHealthStatusStore(
    state => state.statusByWard[wardIdNumber],
  );
  const fetchMyStatus = useHealthStatusStore(state => state.fetchMyStatus);

  // 보호자용 조회(GET /api/mood-check/{wardId})는 어르신 토큰으로 부르면 400이라 본인용 API로 조회함.
  // [DEV] 바로 진입처럼 실로그인 없이 들어오면 wardId가 mock id('mother' 등)라 조회하지 않음
  useFocusEffect(
    useCallback(() => {
      if (!Number.isNaN(wardIdNumber)) {
        fetchMyStatus(wardIdNumber);
      }
    }, [wardIdNumber, fetchMyStatus]),
  );

  const handlePressStatus = async (nextStatus: HealthStatus) => {
    if (Number.isNaN(wardIdNumber)) return;
    try {
      await useHealthStatusStore
        .getState()
        .checkStatus(wardIdNumber, nextStatus);
    } catch (error) {
      // 이모지만 조용히 되돌아가면 왜 안 되는지 알 수 없어서 이유를 안내(마감 시간 이후 등 서버 사유)
      showNotice(
        '건강 상태를 기록하지 못했어요',
        getApiErrorMessage(error) ?? '잠시 후 다시 시도해 주세요.',
      );
    }
  };

  return (
    <View className="rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <ClipboardPulseIcon width={21} height={21} />
        <WardText size="xl" className="font-pretendard-bold text-text-primary">
          오늘의 건강 상태
        </WardText>
      </View>

      <View className="mt-4 rounded-card border border-border bg-surface p-4">
        <View className="flex-row justify-around">
          {HEALTH_STATUS_OPTIONS.map(option => (
            <HealthStatusEmojiButton
              key={option}
              status={option}
              active={status === option}
              onPress={() => handlePressStatus(option)}
            />
          ))}
        </View>
      </View>

      <Pressable
        onPress={onPressRecord}
        className="mt-4 items-center justify-center rounded-card bg-primary py-4"
      >
        <WardText size="xl" className="font-pretendard-semibold text-white">
          오늘의 건강 기록하기
        </WardText>
      </Pressable>
    </View>
  );
}
