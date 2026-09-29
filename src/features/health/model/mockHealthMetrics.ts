export type HealthMetricKey = 'steps' | 'bloodSugar' | 'bloodPressure';

// 건강 수치 그래프 한 장 — 날짜별 값(기록 없는 날은 null)
export interface HealthMetricSeries {
  key: HealthMetricKey;
  label: string;
  unit: string;
  dates: string[];
  values: (number | null)[];
}

// 연동 전 목업 어르신(사용가이드 투어용) 전용 그래프 데이터 — 실제 어르신은 GET /api/health-record/{wardId}/graph 사용
export const MOCK_HEALTH_METRICS: HealthMetricSeries[] = [
  {
    key: 'steps',
    label: '최근 걸음 수',
    unit: '보',
    dates: ['3/31', '4/1', '4/2', '4/3', '4/4', '4/5', '4/6'],
    values: [1200, 2400, 3100, 4200, 3800, 4500, 3200],
  },
  {
    key: 'bloodSugar',
    label: '최근 혈당 수치',
    unit: 'mg/dL',
    dates: ['3/31', '4/1', '4/2', '4/3', '4/4', '4/5', '4/6'],
    values: [55, 82, 107, 123, 117, 123, 113],
  },
  {
    key: 'bloodPressure',
    label: '최근 혈압 수치 (수축기)',
    unit: 'mmHg',
    dates: ['3/31', '4/1', '4/2', '4/3', '4/4', '4/5', '4/6'],
    values: [118, 120, 122, 125, 119, 121, 120],
  },
];
