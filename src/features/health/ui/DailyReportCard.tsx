import React, { useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useWardDailyReport, useWardMoodStatus } from '@features/health/model';
import { buildDailySummary, formatReportTimeLabel, isTimePassedToday } from '@features/health/utils';
import { useWardTodayMedication } from '@features/medication/model';
import EnvelopeFillIcon from '@assets/icons/report/envelope-fill.svg';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import ChevronDownIcon from '@assets/icons/action/chevron-down.svg';
import { DailyReportSummary } from './DailyReportSummary';
import { HealthGraphSection } from './HealthGraphSection';
import { HealthStatusEmojiButton } from './HealthStatusEmojiButton';
import { DropdownAnchor, TimeDropdown } from './TimeDropdown';
import { TourTarget } from '@features/guardian-tour/ui';

export function DailyReportCard({
  wardId,
  wardName,
  forceShowDetail,
}: {
  wardId: string;
  wardName: string;
  // 사용가이드 투어가 "건강 수치 그래프" 단계를 보여줄 때 접힌 상세 영역을 강제로 펼치기 위한 옵션
  forceShowDetail?: boolean;
}) {
  const [showDetail, setShowDetail] = useState(false);
  const isDetailVisible = showDetail || !!forceShowDetail;
  const [timeDropdownAnchor, setTimeDropdownAnchor] = useState<DropdownAnchor | null>(null);
  const timeButtonRef = useRef<React.ComponentRef<typeof Pressable>>(null);
  const status = useWardMoodStatus(wardId) ?? null;
  const medication = useWardTodayMedication(wardId, wardName);
  const dailyReport = useWardDailyReport(wardId);

  const applyReportTime = async (timeKey: string) => {
    if (!(await dailyReport.updateReportTime(timeKey)) && !dailyReport.isMockWard) {
      Alert.alert('', '레포트 시간을 바꾸지 못했어요. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleSelectReportTime = (timeKey: string) => {
    if (timeKey === dailyReport.reportTime) return;
    // 오늘 레포트가 아직 없는데 이미 지난 시각으로 바꾸면 오늘 레포트가 안 만들어지고 어르신 기록도 바로 마감돼서 확인받음
    if (!dailyReport.isMockWard && !dailyReport.report && isTimePassedToday(timeKey)) {
      Alert.alert(
        '레포트 시간을 바꿀까요?',
        `오늘은 이미 ${formatReportTimeLabel(timeKey)}이 지나서 오늘의 레포트는 만들어지지 않고, 어르신의 오늘 기록도 바로 마감돼요. 내일부터 ${formatReportTimeLabel(timeKey)}에 레포트를 받아요.`,
        [
          { text: '취소', style: 'cancel' },
          { text: '바꾸기', onPress: () => applyReportTime(timeKey) },
        ],
      );
      return;
    }
    applyReportTime(timeKey);
  };

  return (
    <TourTarget id="dailyReport.card" className="mt-4 rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <Pressable onPress={() => setShowDetail(prev => !prev)} hitSlop={8}>
          <View style={{ transform: [{ rotate: isDetailVisible ? '90deg' : '0deg' }] }}>
            <ChevronRightIcon width={18} height={18} />
          </View>
        </Pressable>
        <EnvelopeFillIcon width={20} height={15} />
        <Text className="text-xl font-bold text-text-primary">하루 요약 레포트</Text>
      </View>

      <View className="mt-1 flex-row flex-wrap items-center">
        <Text className="text-xs text-text-muted">하루 요약 레포트를 매일 </Text>
        <Pressable
          ref={timeButtonRef}
          className="flex-row items-center gap-1 rounded-[6px] border border-border px-2 py-0.5"
          onPress={() => {
            timeButtonRef.current?.measureInWindow((x, y, width, height) => {
              setTimeDropdownAnchor({ x, y, width, height });
            });
          }}>
          <Text className="text-xs font-pretendard-semibold text-text-primary">
            {formatReportTimeLabel(dailyReport.reportTime)}
          </Text>
          <ChevronDownIcon width={10} height={7} />
        </Pressable>
        <Text className="text-xs text-text-muted"> 시에 받아요</Text>
      </View>

      <TimeDropdown
        visible={timeDropdownAnchor !== null}
        value={dailyReport.reportTime}
        anchor={timeDropdownAnchor}
        onClose={() => setTimeDropdownAnchor(null)}
        onSelect={handleSelectReportTime}
      />
      <Text className="mt-1 text-xs text-text-muted">
        설정한 시간까지 어르신이 기록한 내용으로 레포트가 만들어져요
      </Text>

      <TourTarget id="dailyReport.healthStatus" className="mt-4 rounded-card border border-border bg-surface p-4">
        <Text className="text-md font-semibold text-text-primary">오늘의 건강 상태</Text>
        <View className="mt-3 flex-row justify-around">
          <HealthStatusEmojiButton status="good" active={status === 'good'} />
          <HealthStatusEmojiButton status="normal" active={status === 'normal'} />
          <HealthStatusEmojiButton status="bad" active={status === 'bad'} />
        </View>
      </TourTarget>

      <DailyReportSummary data={dailyReport} liveSummary={buildDailySummary(wardName, status, medication)} />

      {isDetailVisible && <HealthGraphSection series={dailyReport.graph} isLoading={dailyReport.isLoading} />}
    </TourTarget>
  );
}
