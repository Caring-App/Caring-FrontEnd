import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import CalendarEventIcon from '@assets/icons/section/calendar-event.svg';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, 어르신 글자 크기 배율은
// ward-management가 유일한 소스라(useWardFontScaleStore) 이 화면에서도 그대로 가져다 씀
// (순환참조 없음, ward-management는 schedule을 참조하지 않음).
import { WardText } from '@features/ward-management/ui';
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

      <Pressable className="mt-4 items-center justify-center rounded-card bg-primary py-4">
        <WardText size="xl" className="font-pretendard-semibold text-white">
          일정 다시 듣기
        </WardText>
      </Pressable>
    </View>
  );
}
