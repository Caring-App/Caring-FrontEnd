import { getLocalDateKey } from '@shared/utils/date';
import { HEALTH_RECORD_DISEASES } from '../model/healthRecordDiseases';
import type { HealthMetricKey, HealthMetricSeries } from '../model/mockHealthMetrics';
import type {
  DailyReportHealthDetail,
  DailyValue,
  HealthGraphResponse,
  HealthRecordKind,
  HealthRecordResponse,
} from '../model/reportTypes';

// 백엔드 LocalTime 직렬화("21:00:00" / "21:00" / [21, 0]) → 'HH:mm'
export function toReportTimeKey(reportTime: string | number[]): string {
  const [hour = 21, minute = 0] = Array.isArray(reportTime)
    ? reportTime
    : reportTime.split(':').map(part => Number(part));
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

// 'HH:mm' → 화면 표시용 'HH : mm'
export function formatReportTimeLabel(timeKey: string): string {
  return timeKey.replace(':', ' : ');
}

// 오늘을 포함한 최근 N일의 'YYYY-MM-DD' (오래된 날부터)
export function getRecentDateKeys(days: number, now = new Date()): string[] {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1 - index));
    return getLocalDateKey(date);
  });
}

// 'YYYY-MM-DD' → 'M/D'
export function formatShortDate(dateKey: string): string {
  const [, month, day] = dateKey.split('-').map(Number);
  return `${month}/${day}`;
}

const METRIC_META: Record<HealthMetricKey, { label: string; unit: string }> = {
  steps: { label: '최근 걸음 수', unit: '보' },
  bloodSugar: { label: '최근 혈당 수치', unit: 'mg/dL' },
  bloodPressure: { label: '최근 혈압 수치 (수축기)', unit: 'mmHg' },
};

function toSeries(key: HealthMetricKey, points: DailyValue[], dateKeys: string[]): HealthMetricSeries {
  const valueByDate = new Map(points.map(point => [point.date, point.value]));
  return {
    key,
    ...METRIC_META[key],
    dates: dateKeys.map(formatShortDate),
    values: dateKeys.map(dateKey => valueByDate.get(dateKey) ?? null),
  };
}

// 그래프 API 응답 → 차트 시리즈. 혈당·혈압은 어르신이 해당 기저질환을 등록하지 않았으면(null) 빼고, 걸음 수는 항상 포함
export function buildHealthMetricSeries(graph: HealthGraphResponse, dateKeys: string[]): HealthMetricSeries[] {
  const series = [toSeries('steps', graph.steps ?? [], dateKeys)];
  if (graph.bloodSugar) series.push(toSeries('bloodSugar', graph.bloodSugar, dateKeys));
  if (graph.bloodPressure) series.push(toSeries('bloodPressure', graph.bloodPressure, dateKeys));
  return series;
}

const DISEASE_NAME_TO_KIND: Record<string, HealthRecordKind> = Object.fromEntries(
  (Object.keys(HEALTH_RECORD_DISEASES) as HealthRecordKind[]).map(kind => [HEALTH_RECORD_DISEASES[kind].diseaseName, kind]),
);

// 오늘 기록 목록 → 항목별 마지막 값 (그래프와 같은 기준: 하루 여러 건이면 마지막 값)
export function latestHealthValues(records: HealthRecordResponse[]): Partial<Record<HealthRecordKind, number>> {
  const latest: Partial<Record<HealthRecordKind, { value: number; recordedAt: string }>> = {};
  records.forEach(record => {
    const kind = DISEASE_NAME_TO_KIND[record.diseaseName];
    if (!kind) return;
    const current = latest[kind];
    if (!current || record.recordedAt >= current.recordedAt) {
      latest[kind] = { value: record.healthValue, recordedAt: record.recordedAt };
    }
  });
  return Object.fromEntries(Object.entries(latest).map(([kind, entry]) => [kind, entry!.value]));
}

// 하루 요약 레포트의 질병별 평균값 → 항목별 값(소수점 반올림)
export function reportHealthAverages(details: DailyReportHealthDetail[]): Partial<Record<HealthRecordKind, number>> {
  const averages: Partial<Record<HealthRecordKind, number>> = {};
  details.forEach(detail => {
    const kind = DISEASE_NAME_TO_KIND[detail.diseaseName];
    if (kind) averages[kind] = Math.round(detail.avgValue);
  });
  return averages;
}
