import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { logApiError } from '@shared/api';
import { confirmPillApi, getTodayPillsApi } from '../api/pillLogApi';
import { pillNameToMealType } from '../utils';
import { MealType, PillToday } from './medicationTypes';
import { useMedicationStore } from './useMedicationStore';

// 어르신 홈 "복약 관리" 카드용 — 오늘 먹어야 할 복약을 서버(/api/pill/today)에서 받아 시간대별로 묶음.
// - 매일 초기화: 서버가 날짜별 기록(pillLog)을 새로 만들어주므로 앱이 켜진 채 날이 바뀌어도 포그라운드로 돌아올 때 다시 조회
// - 꺼진 시간대: 보호자가 토글로 끈 스케줄·오늘 요일이 아닌 스케줄은 응답에 없어서 해당 버튼을 비활성화
export function useTodayPills(wardId: string) {
  const [pillsBySlot, setPillsBySlot] = useState<Partial<Record<MealType, PillToday>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingSlot, setConfirmingSlot] = useState<MealType | null>(null);
  const [error, setError] = useState('');

  // 같은 기기에서 보호자 화면(MedicationSection, DailyReportCard)이 아직 로컬 스토어를 보고 있어서 함께 맞춰둠
  // — 보호자용 "어르신 오늘 복약 상태" 조회 API가 생기면 이 동기화는 제거
  const syncLocalStore = useCallback(
    (bySlot: Partial<Record<MealType, PillToday>>) => {
      (['morning', 'lunch', 'dinner'] as MealType[]).forEach(slot => {
        useMedicationStore.getState().setTaken(wardId, slot, !!bySlot[slot]?.taken);
      });
    },
    [wardId],
  );

  const fetchTodayPills = useCallback(async () => {
    try {
      const pills = await getTodayPillsApi();
      const bySlot: Partial<Record<MealType, PillToday>> = {};
      pills.forEach(pill => {
        bySlot[pillNameToMealType(pill.pillName)] = pill;
      });
      setPillsBySlot(bySlot);
      syncLocalStore(bySlot);
      setError('');
    } catch (fetchError) {
      logApiError('오늘 복약 목록 조회 실패', fetchError);
      setError('복약 정보를 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  }, [syncLocalStore]);

  useEffect(() => {
    fetchTodayPills();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') fetchTodayPills();
    });
    return () => subscription.remove();
  }, [fetchTodayPills]);

  const confirmPill = async (slot: MealType) => {
    const pill = pillsBySlot[slot];
    if (!pill || pill.taken || confirmingSlot) return;
    setConfirmingSlot(slot);
    try {
      await confirmPillApi(pill.pillLogId);
      const next = { ...pillsBySlot, [slot]: { ...pill, taken: true } };
      setPillsBySlot(next);
      syncLocalStore(next);
    } catch (confirmError) {
      logApiError('복약 확인 실패', confirmError);
      // 다른 기기에서 이미 확인했거나 날짜가 바뀐 경우 등 — 서버 기준 상태로 다시 맞춤
      await fetchTodayPills();
    } finally {
      setConfirmingSlot(null);
    }
  };

  return { pillsBySlot, isLoading, confirmingSlot, confirmPill, error };
}
