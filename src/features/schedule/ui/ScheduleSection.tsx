import React from 'react';
import { SectionCard, AddButton } from '@shared/ui';
import CalendarEventIcon from '@assets/icons/section/calendar-event.svg';
import { HomeScheduleCalendar } from './HomeScheduleCalendar';

export function ScheduleSection({ onPressMore }: { onPressMore?: () => void }) {
  return (
    <SectionCard
      title="일정 관리"
      icon={<CalendarEventIcon width={20} height={20} />}
      action={<AddButton label="일정 등록" onPress={onPressMore} />}>
      <HomeScheduleCalendar />
    </SectionCard>
  );
}
