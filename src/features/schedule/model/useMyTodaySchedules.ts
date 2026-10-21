import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRefreshOnDateChange } from '@shared/model';
import { useSessionStore } from '@shared/store/useSessionStore';
import { ScheduleEntry } from './scheduleRegistrationTypes';
import { useScheduleStore } from './useScheduleStore';

// 돌봄대상자(WARD) 본인 화면에서 오늘 일정을 구독하고, 포커스될 때·날짜가 바뀔 때마다 재조회함.
// 보호자용 useWardSchedules와 달리 wardId 없이 토큰만으로 조회함(GET /api/task-schedule/today).
export function useMyTodaySchedules(): ScheduleEntry[] {
  const schedules = useScheduleStore((state) => state.myTodaySchedules);
  const fetchMyTodaySchedules = useScheduleStore((state) => state.fetchMyTodaySchedules);
  // [DEV] 바로 진입처럼 실로그인 없이 들어온 경우엔 토큰이 없어 401만 나므로 조회하지 않음
  const memberId = useSessionStore((state) => state.profile?.memberId);

  const refresh = useCallback(() => {
    if (memberId != null) {
      fetchMyTodaySchedules();
    }
  }, [memberId, fetchMyTodaySchedules]);

  useFocusEffect(refresh);
  // 화면을 켜둔 채 자정이 지나면 새 날짜의 오늘 일정을 다시 받아옴
  useRefreshOnDateChange(refresh);

  return schedules;
}
