import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScheduleEntry } from './scheduleRegistrationTypes';
import { useScheduleStore } from './useScheduleStore';

const EMPTY_SCHEDULES: ScheduleEntry[] = [];

// wardId(string) 기준으로 일정 목록을 구독하고, 화면이 포커스될 때마다 최신 목록을 조회함
// (@features/location의 useWardLocation과 동일한 패턴 — 홈 화면 카드와 어르신 화면이 로직을 중복하지 않도록 공용 훅으로 뺌).
export function useWardSchedules(wardId: string): ScheduleEntry[] {
  const wardIdNumber = Number(wardId);
  const schedules = useScheduleStore((state) => state.schedulesByWard[wardId]) ?? EMPTY_SCHEDULES;
  const fetchSchedules = useScheduleStore((state) => state.fetchSchedules);

  useFocusEffect(
    useCallback(() => {
      if (!Number.isNaN(wardIdNumber)) {
        fetchSchedules(wardId);
      }
    }, [wardIdNumber, wardId, fetchSchedules]),
  );

  return schedules;
}
