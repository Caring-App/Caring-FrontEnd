import React, { useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import {
  HealthRecordKind,
  HealthStatus,
  useWardDailyReport,
  useWardMoodStatus,
  WardDailyReportData,
} from '@features/health/model';
import { formatReportTimeLabel, reportHealthAverages } from '@features/health/utils';
import { MealType, TodayMedicationStatus, useWardTodayMedication } from '@features/medication/model';
import { MEAL_TYPE_LABELS, MEAL_TYPES } from '@features/medication/utils';
import EnvelopeFillIcon from '@assets/icons/report/envelope-fill.svg';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import ChevronDownIcon from '@assets/icons/action/chevron-down.svg';
import { HealthMetricsChart } from './HealthMetricsChart';
import { HealthStatusEmojiButton } from './HealthStatusEmojiButton';
import { DropdownAnchor, TimeDropdown } from './TimeDropdown';
import { TourTarget } from '@features/guardian-tour/ui';

const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  good: '좋음',
  normal: '보통',
  bad: '안좋음',
};

function buildDailySummary(
  wardName: string,
  status: HealthStatus | null,
  medication: Record<MealType, TodayMedicationStatus>,
) {
  if (!status) {
    return '아직 오늘의 요약 정보가 없어요.';
  }

  // 오늘 먹을 약이 없는 시간대(notScheduled)는 "안 먹음"으로 치지 않음
  const missedSlot = MEAL_TYPES.find(slot => medication[slot] === 'notTaken');
  const hasMedicationToday = MEAL_TYPES.some(slot => medication[slot] !== 'notScheduled');
  const medicationClause = missedSlot
    ? `${wardName}님은 오늘 ${MEAL_TYPE_LABELS[missedSlot]}약을 복용하지 않았어요`
    : hasMedicationToday
      ? `${wardName}님은 오늘 약을 모두 잘 복용했어요`
      : `${wardName}님은 오늘 복용할 약이 없어요`;

  return `${wardName}님의 오늘 건강 상태는 '${HEALTH_STATUS_LABELS[status]}' 이에요! ${medicationClause}`;
}

const HEALTH_VALUE_LABELS: Record<HealthRecordKind, { label: string; unit: string }> = {
  bloodSugar: { label: '혈당', unit: 'mg/dL' },
  bloodPressure: { label: '혈압(수축기)', unit: 'mmHg' },
};

const formatSteps = (steps: number | null) => (steps === null ? '기록 없음' : `${steps.toLocaleString('ko-KR')}보`);

// 혈당·혈압은 어르신이 해당 기저질환을 등록한 경우(그래프에 항목이 있음)나 기록이 있을 때만 보여줌
function visibleHealthKinds(data: WardDailyReportData, values: Partial<Record<HealthRecordKind, number>>) {
  return (Object.keys(HEALTH_VALUE_LABELS) as HealthRecordKind[]).filter(
    kind => values[kind] !== undefined || !!data.graph?.some(series => series.key === kind),
  );
}

// 오늘 하루 요약 수치 줄 — 레포트가 만들어졌으면 레포트 값(질병별 하루 평균, 복약률), 아니면 지금까지의 실시간 값
function SummaryStats({ data }: { data: WardDailyReportData }) {
  const { report } = data;
  const healthValues = report ? reportHealthAverages(report.healthDetails) : data.todayHealth;
  const lines = [`${report ? '걸음 수' : '오늘의 걸음 수'}: ${formatSteps(report ? report.steps : data.todaySteps)}`];
  visibleHealthKinds(data, healthValues).forEach(kind => {
    const { label, unit } = HEALTH_VALUE_LABELS[kind];
    const value = healthValues[kind];
    lines.push(`${report ? `${label} 평균` : `오늘의 ${label}`}: ${value === undefined ? '기록 없음' : `${value} ${unit}`}`);
  });
  if (report) {
    lines.push(
      `복약률: ${report.medicationRate === null ? '오늘 복용할 약 없음' : `${Math.round(report.medicationRate)}%`}`,
    );
  }

  return (
    <View className="mt-3 gap-1">
      {lines.map(line => (
        <Text key={line} className="text-sm text-text-primary">
          {line}
        </Text>
      ))}
    </View>
  );
}

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

  const handleSelectReportTime = async (timeKey: string) => {
    if (timeKey === dailyReport.reportTime) return;
    if (!(await dailyReport.updateReportTime(timeKey)) && !dailyReport.isMockWard) {
      Alert.alert('', '레포트 시간을 바꾸지 못했어요. 잠시 후 다시 시도해 주세요.');
    }
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

      <TourTarget id="dailyReport.summary" className="mt-3 rounded-card border border-border bg-surface p-4">
        <Text className="text-md font-semibold text-text-primary">오늘 하루 요약</Text>
        {/* 레포트 시각이 지나면 서버가 만든 AI 요약을, 그 전에는 지금까지의 기록으로 만든 요약을 보여줌 */}
        <Text className="mt-2 text-sm text-text-primary">
          {dailyReport.report?.healthSummary || buildDailySummary(wardName, status, medication)}
        </Text>
        {!dailyReport.report && (
          <Text className="mt-1 text-xs text-text-muted">
            {formatReportTimeLabel(dailyReport.reportTime)}에 오늘의 레포트가 만들어져요
          </Text>
        )}
        <SummaryStats data={dailyReport} />
      </TourTarget>

      {isDetailVisible && <CompoundHealthDataSection series={dailyReport.graph} isLoading={dailyReport.isLoading} />}
    </TourTarget>
  );
}

function CompoundHealthDataSection({
  series,
  isLoading,
}: {
  series: WardDailyReportData['graph'];
  isLoading: boolean;
}) {
  return (
    <TourTarget id="dailyReport.chart" className="mt-3 rounded-card border border-border bg-surface p-4">
      <Text className="text-md font-semibold text-text-primary">건강 수치 그래프</Text>
      <View className="mt-3">
        {series ? (
          <HealthMetricsChart series={series} />
        ) : (
          <Text className="text-center text-2xs text-text-muted">
            {isLoading ? '그래프를 불러오는 중이에요' : '그래프를 불러오지 못했어요'}
          </Text>
        )}
      </View>
    </TourTarget>
  );
}
