import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import CalendarEventIcon from '@assets/icons/section/calendar-event.svg';
import { ScheduleEntry, formatScheduleTime, isSameDay, to24Hour, useScheduleStore } from '../model';

function formatTodayScheduleTitle(today: Date) {
  return `${today.getMonth() + 1}월 ${today.getDate()}일 오늘의 일정`;
}

// useMemo 의존성 배열에서 안정적인 참조로 취급되도록 매 렌더마다 새로 만들지 않는 빈 배열 fallback
const EMPTY_SCHEDULES: ScheduleEntry[] = [];

// 돌봄대상자 메인 화면의 "일정 관리" 카드. 보호자가 등록해둔 오늘 일정을 시간순으로 보여주고,
// "일정 다시 듣기"로 음성 안내를 다시 들을 수 있게 함
// TODO: 실제 TTS 음성 재생 연동 전이라 지금은 버튼 UI만 있고 눌러도 동작하지 않음
export function WardScheduleCard({ wardId }: { wardId: string }) {
  const schedules = useScheduleStore(state => state.schedulesByWard[wardId]) ?? EMPTY_SCHEDULES;
  // 화면이 떠 있는 동안 자정을 넘기는 경우까지는 고려하지 않음(이 컴포넌트 수명 동안엔 고정값으로 취급)
  const today = useMemo(() => new Date(), []);
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

  return (
    <View className="rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <CalendarEventIcon width={20} height={20} />
        <Text className="text-xl font-pretendard-bold text-text-primary">일정 관리</Text>
      </View>

      <View className="mt-4 rounded-card border border-border bg-surface p-4">
        <Text className="font-pretendard-semibold text-xl text-text-primary">{formatTodayScheduleTitle(today)}</Text>
        <View className="mt-3 gap-2">
          {todaySchedules.length > 0 ? (
            todaySchedules.map(entry => (
              <Text key={entry.id} className="font-pretendard-semibold text-2xl text-text-primary">
                • {formatScheduleTime(entry)} {entry.title}
              </Text>
            ))
          ) : (
            <Text className="font-pretendard-medium text-md text-text-muted">오늘 등록된 일정이 없어요.</Text>
          )}
        </View>
      </View>

      <Pressable className="mt-4 items-center justify-center rounded-card bg-primary py-4">
        <Text className="font-pretendard-semibold text-xl text-white">일정 다시 듣기</Text>
      </Pressable>
    </View>
  );
}
