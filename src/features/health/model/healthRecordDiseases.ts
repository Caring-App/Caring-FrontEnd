import { HealthRecordKind } from './reportTypes';

// 건강 수치 항목 ↔ 백엔드 기저질환. 질환 목록 조회 API가 없어서 백엔드 초기 데이터(schema.sql의 disease INSERT 순서)의
// id를 그대로 씀 — 서버 DB의 disease 데이터가 바뀌면 여기도 맞춰야 함
export const HEALTH_RECORD_DISEASES: Record<HealthRecordKind, { diseaseId: number; diseaseName: string }> = {
  bloodPressure: { diseaseId: 1, diseaseName: '고혈압' },
  bloodSugar: { diseaseId: 2, diseaseName: '당뇨병' },
};
