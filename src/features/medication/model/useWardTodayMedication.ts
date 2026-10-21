import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
// 보호자 알림 목록은 notification feature가 유일한 소스라 그대로 가져다 씀(순환참조 없음 — notification은 medication을 참조하지 않음)
import { useNotificationStore } from '@features/notification/model';
import { useRefreshOnDateChange, useTodayDateKey } from '@shared/model';
import { countTakenMealTypesFromNotifications, getTodayWeekday } from '../utils';
import { MealType } from './medicationTypes';
import { useMedicationListStore } from './useMedicationListStore';
import { useMedicationStore } from './useMedicationStore';

export type TodayMedicationStatus = 'taken' | 'notTaken' | 'notScheduled';

// 실제 연동된 어르신은 id가 memberId 숫자 문자열, 연동 전 목업 어르신('mother' 등)은 문자열 id
const toServerWardId = (wardId: string) => (/^\d+$/.test(wardId) ? Number(wardId) : null);

// 보호자 홈에서 어르신의 오늘 시간대별 복약 상태를 계산 (보호자 기기와 어르신 기기가 달라도 동작)
// - 복용 여부: 보호자 알림 목록의 오늘자 "복약 완료" 알림 개수(countTakenMealTypesFromNotifications 참고)
//   — 어르신 버튼은 시간대 단위라 한 번 누르면 그 시간대의 안 먹은 약을 모두 확인하므로, 알림이 하나라도 있으면 "먹음".
//     스케줄 개수와 알림 개수를 맞춰 보면 안 됨: 오늘치 복약 기록이 만들어진 뒤 추가한 스케줄은 어르신 쪽 목록에 없어서
//     알림이 스케줄 수보다 적게 오고, 어르신 화면은 "먹음"인데 보호자 화면만 "안 먹음"으로 남음(실제로 겪음)
// - 오늘 먹을 시간대: 복약 스케줄 중 켜져 있고 오늘 요일이 포함된 것(어르신 쪽 /api/pill/today와 같은 기준)
// 날짜 기준으로 계산하므로 다음 날이 되면 자동으로 전부 "안 먹음"부터 다시 시작함.
// 연동 전 목업 어르신은 서버 데이터가 없어서 기존 로컬 스토어 값을 그대로 보여줌(사용가이드 투어용).
export function useWardTodayMedication(wardId: string, wardName: string): Record<MealType, TodayMedicationStatus> {
  const serverWardId = toServerWardId(wardId);
  const notifications = useNotificationStore(state => state.notifications);
  const schedules = useMedicationListStore(state =>
    serverWardId === null ? undefined : state.medicationsByWard[serverWardId],
  );
  const localTaken = useMedicationStore(state => state.takenByWard[wardId]);
  // 자정이 지나면 바뀌어서 오늘 기준(요일·알림 날짜)으로 다시 계산됨
  const dateKey = useTodayDateKey();

  if (serverWardId === null) {
    return {
      morning: localTaken?.morning ? 'taken' : 'notTaken',
      lunch: localTaken?.lunch ? 'taken' : 'notTaken',
      dinner: localTaken?.dinner ? 'taken' : 'notTaken',
    };
  }

  const today = getTodayWeekday();
  const takenCount = countTakenMealTypesFromNotifications(notifications, wardName, dateKey);

  const statusOf = (slot: MealType): TodayMedicationStatus => {
    // 먹은 뒤에 보호자가 그 시간대를 꺼도 오늘 먹은 기록은 "먹음"으로 보여줌
    if (takenCount[slot] > 0) return 'taken';
    // 스케줄을 아직 못 불러왔으면 "없음"으로 흐리게 하지 않고 "안 먹음"
    if (!schedules) return 'notTaken';
    const scheduledToday = schedules.some(
      entry => entry.mealType === slot && entry.enabled && entry.days.includes(today),
    );
    return scheduledToday ? 'notTaken' : 'notScheduled';
  };

  return { morning: statusOf('morning'), lunch: statusOf('lunch'), dinner: statusOf('dinner') };
}

// useWardTodayMedication이 쓰는 데이터(알림 목록, 복약 스케줄)를 불러옴 — 홈 화면 포커스 / 앱 복귀 시마다 갱신.
// 같은 데이터를 여러 카드(복약 카드, 하루 요약 레포트)가 읽어서, 불러오기는 화면(GuardianHomeScreen)에서 한 번만 호출
export function useSyncWardTodayMedication(wardId: string) {
  const serverWardId = toServerWardId(wardId);

  const refresh = useCallback(() => {
    if (serverWardId === null) return;
    useNotificationStore.getState().fetchNotifications();
    useMedicationListStore.getState().fetchMedications(serverWardId);
  }, [serverWardId]);

  useFocusEffect(refresh);

  // 화면을 켜둔 채 자정이 지나면 오늘 기준 데이터로 다시 불러옴
  useRefreshOnDateChange(refresh);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') refresh();
    });
    return () => subscription.remove();
  }, [refresh]);
}
