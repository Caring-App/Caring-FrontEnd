import type { HealthStatus } from '../model/useHealthStatusStore';
import type { MoodStatus } from '../model/moodTypes';

const MOOD_STATUS_TO_HEALTH_STATUS: Record<MoodStatus, HealthStatus> = {
  GOOD: 'good',
  NORMAL: 'normal',
  BAD: 'bad',
};

export function moodStatusToHealthStatus(moodStatus: MoodStatus): HealthStatus {
  return MOOD_STATUS_TO_HEALTH_STATUS[moodStatus];
}

const HEALTH_STATUS_TO_MOOD_STATUS: Record<HealthStatus, MoodStatus> = {
  good: 'GOOD',
  normal: 'NORMAL',
  bad: 'BAD',
};

export function healthStatusToMoodStatus(status: HealthStatus): MoodStatus {
  return HEALTH_STATUS_TO_MOOD_STATUS[status];
}

