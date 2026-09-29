import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { getLocalDateKey } from '@shared/utils/date';

// 오늘 날짜 키('YYYY-MM-DD') — 화면을 켜둔 채 자정이 지나면 값이 바뀌어서, 이 값에 의존하는 "오늘" 데이터가
// 다시 계산·조회되게 함. 백그라운드에서는 타이머가 늦게 돌 수 있어 앱으로 돌아올 때도 한 번 더 확인
export function useTodayDateKey() {
  const [dateKey, setDateKey] = useState(getLocalDateKey);

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
    const timer = setTimeout(() => setDateKey(getLocalDateKey()), nextMidnight.getTime() - now.getTime());
    return () => clearTimeout(timer);
  }, [dateKey]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') setDateKey(getLocalDateKey());
    });
    return () => subscription.remove();
  }, []);

  return dateKey;
}
