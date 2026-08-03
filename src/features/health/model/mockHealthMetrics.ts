export type HealthMetricKey = 'steps' | 'bloodSugar' | 'bloodPressure';

export interface HealthMetricSeries {
  key: HealthMetricKey;
  label: string;
  dates: string[];
  values: number[];
  maxValue: number;
  yAxisLabels: number[];
  todayLabel: string;
  todayValue: string;
}

// TODO: 백엔드 연동 전 mock 데이터. 실제 걸음 수/혈당/혈압 API 연동 필요
export const MOCK_HEALTH_METRICS: HealthMetricSeries[] = [
  {
    key: 'steps',
    label: '최근 걸음 수',
    dates: ['3/31', '4/1', '4/2', '4/3', '4/4', '4/5', '4/6'],
    values: [1200, 2400, 3100, 4200, 3800, 4500, 3200],
    maxValue: 5000,
    yAxisLabels: [5000, 4000, 3000, 2000, 1000, 0],
    todayLabel: '오늘의 걸음 수',
    todayValue: '3,200보',
  },
  {
    key: 'bloodSugar',
    label: '최근 혈당 수치',
    dates: ['3/31', '4/1', '4/2', '4/3', '4/4', '4/5', '4/6'],
    values: [55, 82, 107, 123, 117, 123, 113],
    maxValue: 150,
    yAxisLabels: [150, 140, 130, 120, 110, 100, 0],
    todayLabel: '오늘의 혈당 수치',
    todayValue: '113 mg/dL',
  },
  {
    key: 'bloodPressure',
    label: '최근 혈압 수치',
    dates: ['3/31', '4/1', '4/2', '4/3', '4/4', '4/5', '4/6'],
    values: [118, 120, 122, 125, 119, 121, 120],
    maxValue: 150,
    yAxisLabels: [150, 120, 90, 60, 30, 0],
    todayLabel: '오늘의 혈압 수치',
    todayValue: '120/80 mmHg',
  },
];
