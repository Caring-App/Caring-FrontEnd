import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import CalendarEventIcon from '@assets/icons/section/calendar-event.svg';
import { useTodayDateKey } from '@shared/model';
import { WardText } from '@shared/ui';
import {
  formatScheduleTime,
  isSameDay,
  to24Hour,
  useMyTodaySchedules,
  useScheduleVoiceReplay,
} from '../model';
import { taskDateToDate } from '../utils';

function formatTodayScheduleTitle(today: Date) {
  return `${today.getMonth() + 1}월 ${today.getDate()}일 오늘의 일정`;
}

// 돌봄대상자 메인 화면의 "일정 관리" 카드. 보호자가 등록해둔 오늘 일정을 시간순으로 보여주고,
// "일정 다시 듣기"로 오늘 일정의 음성 안내를 시간순으로 다시 들을 수 있게 함(재생 중 다시 누르면 멈춤)
export function WardScheduleCard() {
  const schedules = useMyTodaySchedules();
  // 화면을 켜둔 채 자정이 지나면 바뀌어서 오늘 기준으로 다시 거름(목록 재조회는 useMyTodaySchedules가 함)
  const dateKey = useTodayDateKey();
  const today = useMemo(() => taskDateToDate(dateKey), [dateKey]);
  const todaySchedules = useMemo(
    () =>
      schedules
        .filter(entry => isSameDay(entry.date, today))
        .sort((a, b) => {
          const timeA = to24Hour(a.scheduleTime);
          const timeB = to24Hour(b.scheduleTime);
          return timeA.hour * 60 + timeA.minute - (timeB.hour * 60 + timeB.minute);
        }),
    [schedules, today],
  );
  const { isPlaying, toggleReplay } = useScheduleVoiceReplay(todaySchedules);

  return (
    <View className="rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <CalendarEventIcon width={20} height={20} />
        <WardText size="xl" className="font-pretendard-bold text-text-primary">
          일정 관리
        </WardText>
      </View>

      <View className="mt-4 rounded-card border border-border bg-surface p-4">
        <WardText size="xl" className="font-pretendard-semibold text-text-primary">
          {formatTodayScheduleTitle(today)}
        </WardText>
        <View className="mt-3 gap-2">
          {todaySchedules.length > 0 ? (
            todaySchedules.map(entry => (
              <WardText key={entry.id} size="2xl" className="font-pretendard-semibold text-text-primary">
                • {formatScheduleTime(entry)} {entry.title}
              </WardText>
            ))
          ) : (
            <WardText size="md" className="font-pretendard-medium text-text-muted">
              오늘 등록된 일정이 없어요.
            </WardText>
          )}
        </View>
      </View>

      <Pressable
        onPress={toggleReplay}
        className="mt-4 items-center justify-center rounded-card bg-primary py-4"
        accessibilityState={{ busy: isPlaying }}>
        <WardText size="xl" className="font-pretendard-semibold text-white">
          {isPlaying ? '듣기 멈추기' : '일정 다시 듣기'}
        </WardText>
      </Pressable>
    </View>
  );
}
