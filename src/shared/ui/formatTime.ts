import type { TimeState } from '@shared/types';

export function formatTime({ hour, minute, second, amPm }: TimeState) {
  return `${hour}:${minute}:${second} ${amPm}`;
}
