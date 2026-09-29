import { create } from 'zustand';
import { logApiError } from '@shared/api';
import { resetOnLogout } from '@shared/store/resetOnLogout';
import { getHealthGraphApi, getTodayHealthRecordsApi } from '../api/healthRecordApi';
import { getTodayDailyReportApi } from '../api/dailyReportApi';
import { getReportTimeApi, updateReportTimeApi } from '../api/reportSettingApi';
import { getTodayStepsApi } from '../api/stepRecordApi';
import { buildHealthMetricSeries, getRecentDateKeys, latestHealthValues, toReportTimeKey } from '../utils/reportUtils';
import type { DailyReportResponse, HealthMetricSeries, HealthRecordKind } from './reportTypes';

// 그래프에 보여줄 기간(오늘 포함)
export const HEALTH_GRAPH_DAYS = 7;

export interface WardDailyReportData {
  // 'HH:mm' — 레포트가 만들어지는 시각이자 어르신의 기분·건강 수치·걸음 수 기록 마감 시각
  reportTime: string | null;
  // 레포트 시각이 지나 서버가 만든 오늘 레포트(AI 요약 포함). 아직이면 null
  report: DailyReportResponse | null;
  // 레포트 전에 보여줄 오늘 실시간 값
  todaySteps: number | null;
  todayHealth: Partial<Record<HealthRecordKind, number>>;
  graph: HealthMetricSeries[] | null;
}

export const EMPTY_DAILY_REPORT_DATA: WardDailyReportData = { reportTime: null, report: null, todaySteps: null, todayHealth: {}, graph: null };

interface DailyReportState {
  dataByWard: Record<number, WardDailyReportData>;
  loadingWardIds: Set<number>;
  fetchDailyReport: (wardId: number) => Promise<void>;
  // 성공하면 true — 실패하면 이전 시각으로 되돌리고 false
  updateReportTime: (wardId: number, timeKey: string) => Promise<boolean>;
}

function patchWard(wardId: number, patch: Partial<WardDailyReportData>) {
  useDailyReportStore.setState(state => ({
    dataByWard: { ...state.dataByWard, [wardId]: { ...(state.dataByWard[wardId] ?? EMPTY_DAILY_REPORT_DATA), ...patch } },
  }));
}

export const useDailyReportStore = create<DailyReportState>((set, get) => ({
  dataByWard: {},
  loadingWardIds: new Set(),

  // 5개 API를 동시에 부르고, 일부가 실패해도 성공한 값은 반영함(하나 실패로 카드 전체가 비지 않게)
  fetchDailyReport: async wardId => {
    if (get().loadingWardIds.has(wardId)) return;
    set(state => ({ loadingWardIds: new Set(state.loadingWardIds).add(wardId) }));

    const dateKeys = getRecentDateKeys(HEALTH_GRAPH_DAYS);
    const [reportTime, report, todaySteps, todayRecords, graph] = await Promise.allSettled([
      getReportTimeApi(wardId),
      getTodayDailyReportApi(wardId),
      getTodayStepsApi(wardId),
      getTodayHealthRecordsApi(wardId),
      getHealthGraphApi(wardId, dateKeys[0], dateKeys[dateKeys.length - 1]),
    ]);

    const patch: Partial<WardDailyReportData> = {};
    if (reportTime.status === 'fulfilled') patch.reportTime = toReportTimeKey(reportTime.value.reportTime);
    else logApiError('레포트 시각 조회 실패', reportTime.reason);
    if (report.status === 'fulfilled') patch.report = report.value;
    else logApiError('하루 요약 레포트 조회 실패', report.reason);
    if (todaySteps.status === 'fulfilled') patch.todaySteps = todaySteps.value?.steps ?? null;
    else logApiError('오늘 걸음 수 조회 실패', todaySteps.reason);
    if (todayRecords.status === 'fulfilled') patch.todayHealth = latestHealthValues(todayRecords.value);
    else logApiError('오늘 건강 수치 조회 실패', todayRecords.reason);
    if (graph.status === 'fulfilled') patch.graph = buildHealthMetricSeries(graph.value, dateKeys);
    else logApiError('건강 수치 그래프 조회 실패', graph.reason);

    patchWard(wardId, patch);
    set(state => {
      const next = new Set(state.loadingWardIds);
      next.delete(wardId);
      return { loadingWardIds: next };
    });
  },

  // 드롭다운에서 고르면 바로 바뀌어야 자연스러워서 먼저 반영하고, 실패하면 되돌림
  updateReportTime: async (wardId, timeKey) => {
    const previous = get().dataByWard[wardId]?.reportTime ?? null;
    patchWard(wardId, { reportTime: timeKey });
    try {
      await updateReportTimeApi(wardId, timeKey);
      return true;
    } catch (error) {
      logApiError('레포트 시각 변경 실패', error);
      patchWard(wardId, { reportTime: previous });
      return false;
    }
  },
}));

resetOnLogout(useDailyReportStore);
