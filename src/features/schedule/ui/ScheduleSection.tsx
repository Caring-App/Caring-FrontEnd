import React, { useState } from 'react';
import { SectionCard, AddButton } from '@shared/ui';
import CalendarEventIcon from '@assets/icons/section/calendar-event.svg';
import { ScheduleEntry } from '../model/scheduleRegistrationTypes';
import { HomeScheduleCalendar } from './HomeScheduleCalendar';
import { ScheduleRegistrationModal } from './ScheduleRegistrationModal';

interface ScheduleSectionProps {
  wardId: string;
  wardName: string;
}

export function ScheduleSection({ wardId, wardName }: ScheduleSectionProps) {
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleEntry | null>(null);

  const openCreate = () => {
    setEditingSchedule(null);
    setIsRegistrationVisible(true);
  };
  const openEdit = (schedule: ScheduleEntry) => {
    setEditingSchedule(schedule);
    setIsRegistrationVisible(true);
  };

  return (
    <SectionCard
      title="일정 관리"
      icon={<CalendarEventIcon width={20} height={20} />}
      action={<AddButton label="일정 등록" onPress={openCreate} />}>
      <HomeScheduleCalendar wardId={wardId} wardName={wardName} onRequestEdit={openEdit} />

      <ScheduleRegistrationModal
        visible={isRegistrationVisible}
        wardId={wardId}
        wardName={wardName}
        editingSchedule={editingSchedule}
        onClose={() => setIsRegistrationVisible(false)}
      />
    </SectionCard>
  );
}
