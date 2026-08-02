import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ScheduleItem } from '../types/senior';
import CalendarEventIcon from '@assets/icons/section/calendar-event.svg';

interface ScheduleCardProps {
  dateText: string;
  schedules: ScheduleItem[];
  onListen: () => void;
}

export const ScheduleCard = ({ dateText, schedules, onListen }: ScheduleCardProps) => {
  const hasSchedules = schedules && schedules.length > 0;

  return (
    <View className="bg-white rounded-2xl border border-gray-200 p-4 mb-5 shadow-sm">
      <View className="flex-row items-center mb-4">
        <CalendarEventIcon width={22} height={22} style={{ marginRight: 8 }} />
        <Text className="text-lg font-bold text-gray-900">일정 관리</Text>
      </View>

      <View className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-3 min-h-[100px] justify-center">
        {hasSchedules ? (
          <>
            <Text className="text-base font-bold text-gray-900 mb-3">{dateText} 오늘의 일정</Text>
            {schedules.map((item) => (
              <Text key={item.id} className="text-sm font-semibold text-gray-800 mb-1.5">
                •  {item.time} {item.title}
              </Text>
            ))}
          </>
        ) : (
          <View className="items-center py-2">
            <Text className="text-sm font-medium text-gray-400">
              아직 등록된 일정이 없어요.
            </Text>
          </View>
        )}
      </View>

      <Pressable
        onPress={onListen}
        className="bg-primary rounded-xl py-3.5 items-center active:opacity-80"
      >
        <Text className="text-white font-bold text-base">일정 다시 듣기</Text>
      </Pressable>
    </View>
  );
};