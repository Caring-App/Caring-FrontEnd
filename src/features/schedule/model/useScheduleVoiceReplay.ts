import { useEffect, useRef, useState } from 'react';
import { showNotice } from '@shared/model';
import { playVoice, stopVoice } from '@shared/utils/voicePlayer';
import { ScheduleEntry } from './scheduleRegistrationTypes';

// 어르신 홈 "일정 다시 듣기" — 오늘 일정의 안내 음성(보호자 녹음 또는 서버가 만든 TTS)을 시간순으로 이어서 재생.
// 재생 중에 다시 누르면 멈춤. 알림 음성이 오면 그 음성이 우선(voicePlayer는 한 번에 하나만 재생)이라 여기선 이어 듣기를 멈춤
export function useScheduleVoiceReplay(schedules: ScheduleEntry[]) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);

  // 재생 중에 화면을 떠나면(로그아웃 등) 음성도 멈춤
  useEffect(
    () => () => {
      if (isPlayingRef.current) stopVoice();
    },
    [],
  );

  const toggleReplay = async () => {
    if (isPlayingRef.current) {
      stopVoice();
      return;
    }
    const urls = schedules.map(entry => entry.voiceFileUrl).filter(url => !!url);
    if (urls.length === 0) {
      showNotice('오늘 들을 일정이 없어요');
      return;
    }

    isPlayingRef.current = true;
    setIsPlaying(true);
    let failedCount = 0;
    try {
      for (const url of urls) {
        const result = await playVoice(url);
        if (result === 'stopped') break;
        if (result === 'failed') failedCount += 1;
      }
    } finally {
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
    if (failedCount === urls.length) {
      showNotice('일정 안내를 들려드리지 못했어요', '잠시 후 다시 눌러 주세요.');
    }
  };

  return { isPlaying, toggleReplay };
}
