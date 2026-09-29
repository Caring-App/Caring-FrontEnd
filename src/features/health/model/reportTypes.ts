// 하루 요약 레포트 관련 백엔드 DTO (/v3/api-docs의 health-record / step-record / report-setting / daily-report 기준)
// 와 화면용 타입

export type HealthMetricKey = 'steps' | 'bloodSugar' | 'bloodPressure';

// 건강 수치 그래프 한 장 — 날짜별 값(기록 없는 날은 null)
export interface HealthMetricSeries {
  key: HealthMetricKey;
  label: string;
  unit: string;
  dates: string[];
  values: (number | null)[];
}

// 건강 수치를 기록할 수 있는 항목 — 백엔드는 기저질환별 숫자 하나만 받음(HealthRecordRequestDto)
export type HealthRecordKind = 'bloodSugar' | 'bloodPressure';

// POST /api/health-record — 어르신 본인이 기록(토큰으로 식별). 하루 여러 번 기록 가능(매번 새로 저장)
export interface HealthRecordRequest {
  diseaseId: number;
  healthValue: number;
}

// GET /api/health-record/{wardId} — 보호자가 조회하는 오늘 기록 목록(기록 순서대로)
export interface HealthRecordResponse {
  diseaseName: string;
  healthValue: number;
  recordedAt: string;
}

// GET /api/health-record/{wardId}/graph — 기간별 그래프. 하루 여러 건이면 그날 마지막 값만 옴.
// 혈당·혈압은 어르신이 해당 기저질환(당뇨병·고혈압)을 등록한 경우에만 배열, 아니면 null
export interface DailyValue {
  date: string;
  value: number;
}

export interface HealthGraphResponse {
  bloodSugar: DailyValue[] | null;
  bloodPressure: DailyValue[] | null;
  steps: DailyValue[];
}

// GET /api/step-record/{wardId} — 오늘 기록이 없으면 본문 없이 옴
export interface StepRecordResponse {
  steps: number;
  recordedDate: string;
}

// GET /api/report-setting/{wardId} — 백엔드 LocalTime 직렬화 형태("21:00:00" 또는 [21, 0])를 둘 다 받음
export interface ReportTimeResponse {
  reportTime: string | number[];
}

// GET /api/daily-report/{wardId}/today — 레포트 시각이 지나 서버가 만든 오늘 레포트
export interface DailyReportHealthDetail {
  diseaseName: string;
  avgValue: number;
}

export interface DailyReportResponse {
  reportId: number;
  reportDate: string;
  moodStatus: string | null;
  steps: number | null;
  // 서버가 AI(Gemini)로 만든 보호자용 한 문단 요약
  healthSummary: string;
  medicationRate: number | null;
  isDelivered: boolean;
  healthDetails: DailyReportHealthDetail[];
}
