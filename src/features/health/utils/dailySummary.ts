// FSD상 feature끼리 참조하지 않는 게 이상적이지만, 하루 요약 문구에 복약 상태가 들어가서 medication의 타입·상수를 씀
// (순환참조 없음 — medication은 health를 참조하지 않음)
import type { MealType, TodayMedicationStatus } from '@features/medication/model';
import { MEAL_TYPE_LABELS, MEAL_TYPES } from '@features/medication/utils';
import type { HealthStatus } from '../model/useHealthStatusStore';
import type { HealthRecordKind } from '../model/reportTypes';
import type { WardDailyReportData } from '../model/useDailyReportStore';
import { reportHealthAverages } from './reportUtils';

const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  good: '좋음',
  normal: '보통',
  bad: '안좋음',
};

// 레포트가 만들어지기 전 "오늘 하루 요약" 문구 — 오늘의 기분 상태 + 복약 상태
export function buildDailySummary(
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
  bloodSugar: { label: '혈당 수치', unit: 'mg/dL' },
  bloodPressure: { label: '혈압 수치', unit: 'mmHg' },
};

const formatSteps = (steps: number | null) => (steps === null ? '기록 없음' : `${steps.toLocaleString('ko-KR')}보`);

// "오늘 하루 요약" 아래 수치 줄(카드를 펼쳤을 때) — 걸음 수·혈당·혈압은 기록이 없어도 항상 보여줌.
// 레포트가 만들어졌으면 레포트 값(질병별 하루 평균, 복약률), 아니면 지금까지의 실시간 값
export function buildSummaryStatLines(data: WardDailyReportData): string[] {
  const { report } = data;
  const healthValues = report ? reportHealthAverages(report.healthDetails) : data.todayHealth;
  const lines = [`${report ? '걸음 수' : '오늘의 걸음 수'}: ${formatSteps(report ? report.steps : data.todaySteps)}`];
  (Object.keys(HEALTH_VALUE_LABELS) as HealthRecordKind[]).forEach(kind => {
    const { label, unit } = HEALTH_VALUE_LABELS[kind];
    const value = healthValues[kind];
    lines.push(`${report ? `${label} 평균` : `오늘의 ${label}`}: ${value === undefined ? '기록 없음' : `${value} ${unit}`}`);
  });
  if (report) {
    lines.push(`복약률: ${report.medicationRate === null ? '오늘 복용할 약 없음' : `${Math.round(report.medicationRate)}%`}`);
  }
  return lines;
}
