import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRefreshOnDateChange } from '@shared/model';
import { MOCK_HEALTH_METRICS } from './mockHealthMetrics';
import { EMPTY_DAILY_REPORT_DATA, useDailyReportStore, WardDailyReportData } from './useDailyReportStore';

// 기본 레포트 시각 — 서버 기본값(ReportSetting.DEFAULT_REPORT_TIME)과 같음. 조회 전·목업 어르신에 사용
export const DEFAULT_REPORT_TIME = '21:00';

// 연동 전 목업 어르신(사용가이드 투어용) — 서버 데이터가 없어 목업 그래프의 마지막 값을 오늘 값으로 보여줌
const lastValue = (index: number) => MOCK_HEALTH_METRICS[index].values[MOCK_HEALTH_METRICS[index].values.length - 1];
const MOCK_DATA: WardDailyReportData = {
  reportTime: DEFAULT_REPORT_TIME,
  report: null,
  todaySteps: lastValue(0),
  todayHealth: { bloodSugar: lastValue(1) ?? undefined, bloodPressure: lastValue(2) ?? undefined },
  graph: MOCK_HEALTH_METRICS,
};

// 보호자 홈 "하루 요약 레포트" 카드 — 레포트 시각, 오늘 레포트, 오늘 걸음 수·건강 수치, 최근 7일 그래프를 구독.
// 어르신이 하루 중 계속 기록하고 레포트는 설정 시각에 만들어져서, 화면 포커스·앱 복귀·날짜 변경 때마다 다시 조회함
export function useWardDailyReport(wardId: string) {
  const wardIdNumber = Number(wardId);
  const isMockWard = Number.isNaN(wardIdNumber);
  const data = useDailyReportStore(state => state.dataByWard[wardIdNumber]);
  const isLoading = useDailyReportStore(state => state.loadingWardIds.has(wardIdNumber));

  const refresh = useCallback(() => {
    if (!isMockWard) useDailyReportStore.getState().fetchDailyReport(wardIdNumber);
  }, [isMockWard, wardIdNumber]);

  useFocusEffect(refresh);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  // 화면을 켜둔 채 자정이 지나면 오늘 기준으로 다시 조회
  useRefreshOnDateChange(refresh);

  const updateReportTime = (timeKey: string) =>
    isMockWard ? Promise.resolve(false) : useDailyReportStore.getState().updateReportTime(wardIdNumber, timeKey);

  const resolved = isMockWard ? MOCK_DATA : (data ?? EMPTY_DAILY_REPORT_DATA);
  return {
    ...resolved,
    reportTime: resolved.reportTime ?? DEFAULT_REPORT_TIME,
    isLoading,
    isMockWard,
    updateReportTime,
  };
}
