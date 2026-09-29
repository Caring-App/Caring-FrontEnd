import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
// 보호자 알림 목록은 notification feature가 유일한 소스라 그대로 가져다 씀(순환참조 없음 — notification은 medication을 참조하지 않음)
import { useNotificationStore } from '@features/notification/model';
import { getLocalDateKey } from '@shared/utils/date';
import { countTakenMealTypesFromNotifications, getTodayWeekday } from '../utils';
import { MealType } from './medicationTypes';
import { useMedicationListStore } from './useMedicationListStore';
import { useMedicationStore } from './useMedicationStore';

export type TodayMedicationStatus = 'taken' | 'notTaken' | 'notScheduled';

// 실제 연동된 어르신은 id가 memberId 숫자 문자열, 연동 전 목업 어르신('mother' 등)은 문자열 id
const toServerWardId = (wardId: string) => (/^\d+$/.test(wardId) ? Number(wardId) : null);

// 보호자 홈에서 어르신의 오늘 시간대별 복약 상태를 계산 (보호자 기기와 어르신 기기가 달라도 동작)
// - 복용 여부: 보호자 알림 목록의 오늘자 "복약 완료" 알림 개수(countTakenMealTypesFromNotifications 참고)
//   — 같은 시간대 스케줄이 여러 개면 전부 확인돼야(알림 개수 ≥ 오늘 스케줄 개수) "먹음"
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

  if (serverWardId === null) {
    return {
      morning: localTaken?.morning ? 'taken' : 'notTaken',
      lunch: localTaken?.lunch ? 'taken' : 'notTaken',
      dinner: localTaken?.dinner ? 'taken' : 'notTaken',
    };
  }

  const today = getTodayWeekday();
  const scheduledCount: Record<MealType, number> = { morning: 0, lunch: 0, dinner: 0 };
  (schedules ?? [])
    .filter(entry => entry.enabled && entry.days.includes(today))
    .forEach(entry => {
      scheduledCount[entry.mealType] += 1;
    });
  const takenCount = countTakenMealTypesFromNotifications(notifications, wardName, getLocalDateKey());

  const statusOf = (slot: MealType): TodayMedicationStatus => {
    // 스케줄을 아직 못 불러왔으면 알림만 보고 판단("없음"으로 흐리게 하지 않음)
    if (!schedules) return takenCount[slot] > 0 ? 'taken' : 'notTaken';
    // 먹은 뒤에 보호자가 그 시간대를 꺼도 오늘 먹은 기록은 "먹음"으로 보여줌
    if (scheduledCount[slot] === 0) return takenCount[slot] > 0 ? 'taken' : 'notScheduled';
    return takenCount[slot] >= scheduledCount[slot] ? 'taken' : 'notTaken';
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

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') refresh();
    });
    return () => subscription.remove();
  }, [refresh]);
}
