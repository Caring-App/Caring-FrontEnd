import React from 'react';
import { Pressable, Text } from 'react-native';
import { SectionCard, AddButton } from '@shared/ui';
import CalendarEventIcon from '@assets/icons/section/calendar-event.svg';

export function ScheduleSection({ onPressMore }: { onPressMore?: () => void }) {
  return (
    <SectionCard
      title="일정 관리"
      icon={<CalendarEventIcon width={20} height={20} />}
      action={<AddButton label="일정 등록" onPress={onPressMore} />}>
      {/* TODO: features/schedule 실제 캘린더 컴포넌트로 교체 */}
      <Pressable
        onPress={onPressMore}
        className="mt-3 items-center justify-center rounded-card border border-border bg-surface py-10">
        <Text className="text-sm text-text-muted">캘린더 (준비 중, 눌러서 일정 관리로 이동)</Text>
      </Pressable>
    </SectionCard>
  );
}
