import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { logApiError } from '@shared/api';
import { useTodayDateKey } from '@shared/model';
import { confirmPillApi, getTodayPillsApi } from '../api/pillLogApi';
import { pillNameToMealType } from '../utils';
import { MealType, PillToday } from './medicationTypes';

// 어르신 홈 "복약 관리" 카드용 — 오늘 먹어야 할 복약을 서버(/api/pill/today)에서 받아 시간대별로 묶음.
// - 매일 초기화: 서버가 날짜별 기록(pillLog)을 새로 만들어주므로 앱이 켜진 채 날이 바뀌어도 포그라운드로 돌아올 때 다시 조회
// - 꺼진 시간대: 보호자가 토글로 끈 스케줄·오늘 요일이 아닌 스케줄은 응답에 없어서 해당 버튼을 비활성화
// - 같은 시간대에 스케줄이 여러 개일 수 있음(예: 아침약 8시·10시 — 백엔드·등록 화면 모두 허용) → 시간대별 목록으로 묶고,
//   버튼 한 번에 그 시간대의 안 먹은 약을 모두 확인하며, 전부 먹었을 때만 "먹음"으로 표시
export type TodayPillsBySlot = Partial<Record<MealType, PillToday[]>>;

export function useTodayPills() {
  const [pillsBySlot, setPillsBySlot] = useState<TodayPillsBySlot>({});
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingSlot, setConfirmingSlot] = useState<MealType | null>(null);
  const [error, setError] = useState('');
  // 화면을 켜둔 채 자정이 지나면 바뀌어서 오늘 목록을 다시 받아옴
  const dateKey = useTodayDateKey();

  const fetchTodayPills = useCallback(async () => {
    try {
      const pills = await getTodayPillsApi();
      const bySlot: TodayPillsBySlot = {};
      pills.forEach(pill => {
        const slot = pillNameToMealType(pill.pillName);
        bySlot[slot] = [...(bySlot[slot] ?? []), pill];
      });
      setPillsBySlot(bySlot);
      setError('');
    } catch (fetchError) {
      logApiError('오늘 복약 목록 조회 실패', fetchError);
      setError('복약 정보를 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayPills();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') fetchTodayPills();
    });
    return () => subscription.remove();
  }, [fetchTodayPills, dateKey]);

  const confirmPill = async (slot: MealType) => {
    const untaken = (pillsBySlot[slot] ?? []).filter(pill => !pill.taken);
    if (untaken.length === 0 || confirmingSlot) return;
    setConfirmingSlot(slot);
    try {
      const results = await Promise.allSettled(untaken.map(pill => confirmPillApi(pill.pillLogId)));
      const failed = results.filter((result): result is PromiseRejectedResult => result.status === 'rejected');
      if (failed.length > 0) {
        failed.forEach(result => logApiError('복약 확인 실패', result.reason));
        // 다른 기기에서 이미 확인했거나 날짜가 바뀐 경우 등 — 일부만 성공했을 수도 있어서 서버 기준 상태로 다시 맞춤
        await fetchTodayPills();
        return;
      }
      const confirmedIds = new Set(untaken.map(pill => pill.pillLogId));
      setPillsBySlot(prev => ({
        ...prev,
        [slot]: (prev[slot] ?? []).map(pill => (confirmedIds.has(pill.pillLogId) ? { ...pill, taken: true } : pill)),
      }));
    } finally {
      setConfirmingSlot(null);
    }
  };

  return { pillsBySlot, isLoading, confirmingSlot, confirmPill, error };
}
