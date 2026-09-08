import type { TimeState } from '@shared/types';
import { ScheduleEntry, ScheduleRegistrationData, ScheduleSoundType } from '../model/scheduleRegistrationTypes';
import { TaskAlarmType, TaskSchedule, TaskScheduleRequest } from '../model/taskScheduleTypes';

export function dateToTaskDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function taskDateToDate(taskDate: string): Date {
  const [year, month, day] = taskDate.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

// taskTime/ttsVoiceTime 형식 가정 — TaskSchedule 타입 주석 참고("HH:mm:ss").
export function timeStateToTaskTime({ hour, minute, second, amPm }: TimeState): string {
  const hour24 = (Number(hour) % 12) + (amPm === 'PM' ? 12 : 0);
  return `${String(hour24).padStart(2, '0')}:${minute}:${second}`;
}

export function taskTimeToTimeState(taskTime: string): TimeState {
  const [hourStr, minuteStr, secondStr] = taskTime.split(':');
  const hour24 = Number(hourStr) || 0;
  const amPm: TimeState['amPm'] = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour: String(hour12).padStart(2, '0'), minute: minuteStr ?? '00', second: secondStr ?? '00', amPm };
}

export function soundTypeToAlarmType(soundType: ScheduleSoundType): TaskAlarmType {
  return soundType === 'voice' ? 'VOICE' : 'TTS';
}

export function alarmTypeToSoundType(alarmType: TaskAlarmType): ScheduleSoundType {
  return alarmType === 'VOICE' ? 'voice' : 'tts';
}

// ttsMessage - 등록 폼에 문구를 직접 입력하는 필드가 없어 일정 이름 기반으로 자동 생성.
export function buildTtsMessage(taskName: string): string {
  return `${taskName} 일정 시간이에요.`;
}

export function taskScheduleToEntry(schedule: TaskSchedule): ScheduleEntry {
  return {
    id: schedule.taskId,
    title: schedule.taskName,
    location: schedule.locationName,
    placeId: schedule.placeId,
    date: taskDateToDate(schedule.taskDate),
    scheduleTime: taskTimeToTimeState(schedule.taskTime),
    alarmTime: taskTimeToTimeState(schedule.ttsVoiceTime),
    soundType: alarmTypeToSoundType(schedule.alarmType),
  };
}

export function buildTaskScheduleRequest(data: ScheduleRegistrationData): TaskScheduleRequest {
  return {
    taskName: data.title,
    locationName: data.location,
    placeId: data.placeId,
    taskDate: dateToTaskDate(data.date),
    taskTime: timeStateToTaskTime(data.scheduleTime),
    ttsVoiceTime: timeStateToTaskTime(data.alarmTime),
    ttsMessage: buildTtsMessage(data.title),
    alarmType: soundTypeToAlarmType(data.soundType),
    // TODO: useVoiceRecording이 아직 로컬 스텁이라(실제 파일 업로드 없음) 항상 빈 값으로 보냄 — 녹음 업로드 붙으면 채우기
    voiceFileUrl: '',
  };
}
