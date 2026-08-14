import { useEffect, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';
import { useTourStore } from './useTourStore';

// 사용가이드가 위치를 추적해야 하는 ScrollView에 공통으로 필요한 ref 등록 +
// onScroll/onMomentumScrollEnd 배선을 한 곳에 모은 훅. scrollId는 useTourStore의
// scrollRefs/scrollOffsets/scrollSettleTicks 키로 쓰이며 TourStep.scrollId와 매칭됨
export function useTourScrollTracking(scrollId: string) {
  const ref = useRef<ScrollView>(null);

  useEffect(() => {
    useTourStore.getState().registerScrollRef(scrollId, ref);
  }, [scrollId]);

  const scrollHandlers = {
    scrollEventThrottle: 16,
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      useTourStore.getState().setScrollOffset(scrollId, event.nativeEvent.contentOffset.y);
    },
    onMomentumScrollEnd: () => {
      useTourStore.getState().notifyScrollSettled(scrollId);
    },
  };

  return { ref, scrollHandlers };
}
