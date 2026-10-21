import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScheduleEntry } from './scheduleRegistrationTypes';
import { useScheduleStore } from './useScheduleStore';

const EMPTY_SCHEDULES: ScheduleEntry[] = [];

// 보호자 화면 전용 — wardId(string) 기준으로 month가 속한 달의 일정 목록을 구독하고, 화면이 포커스될 때와
// 달이 바뀔 때마다 최신 목록을 조회함(@features/location의 useWardLocation과 동일한 패턴).
export function useWardSchedules(wardId: string, month: Date): ScheduleEntry[] {
  const wardIdNumber = Number(wardId);
  // Date 객체는 렌더마다 새로 만들어질 수 있어서, 같은 달이면 재조회하지 않도록 연·월 값으로만 의존성을 잡음
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const schedules = useScheduleStore((state) => state.schedulesByWard[wardId]) ?? EMPTY_SCHEDULES;
  const fetchSchedules = useScheduleStore((state) => state.fetchSchedules);

  useFocusEffect(
    useCallback(() => {
      if (!Number.isNaN(wardIdNumber)) {
        fetchSchedules(wardId, new Date(year, monthIndex, 1));
      }
    }, [wardIdNumber, wardId, year, monthIndex, fetchSchedules]),
  );

  return schedules;
}
