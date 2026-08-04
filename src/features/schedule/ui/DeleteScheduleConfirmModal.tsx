import React, { useEffect, useState } from 'react';
import { ConfirmModal } from '@shared/ui';
import { ScheduleEntry } from '../model/scheduleRegistrationTypes';
import { formatScheduleDateTimeShort } from '../model/scheduleFormat';

interface DeleteScheduleConfirmModalProps {
  visible: boolean;
  schedule: ScheduleEntry | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteScheduleConfirmModal({ visible, schedule, onCancel, onConfirm }: DeleteScheduleConfirmModalProps) {
  // 닫히는 순간 schedule이 바로 null이 되므로 fade-out 동안엔 마지막 값을 유지
  const [displaySchedule, setDisplaySchedule] = useState(schedule);

  useEffect(() => {
    if (schedule) {
      setDisplaySchedule(schedule);
    }
  }, [schedule]);

  if (!displaySchedule) {
    return null;
  }

  return (
    <ConfirmModal
      visible={visible}
      title="일정을 삭제 하시겠어요?"
      subtitle={`${formatScheduleDateTimeShort(displaySchedule)} - ${displaySchedule.location}`}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
