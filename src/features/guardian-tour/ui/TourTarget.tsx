import React, { useEffect, useRef } from 'react';
import { LayoutChangeEvent, View, ViewProps } from 'react-native';
import { useTourStore } from '../model/useTourStore';
import { TOUR_STEPS } from '../model/tourSteps';

interface TourTargetProps extends ViewProps {
  id: string;
  children: React.ReactNode;
}

// 사용가이드 투어가 하이라이트할 수 있는 영역을 표시하는 래퍼.
// 화면 레이아웃/모양은 전혀 바꾸지 않고, 자기 자신의 ref를 투어 스토어에 등록만 함.
export function TourTarget({ id, children, onLayout, ...rest }: TourTargetProps) {
  const viewRef = useRef<View>(null);

  useEffect(() => {
    useTourStore.getState().registerTargetRef(id, viewRef);
    return () => {
      useTourStore.getState().unregisterTargetRef(id, viewRef);
    };
  }, [id]);

  // 하이라이트는 스텝이 시작될 때 한 번 측정하는데, 그 뒤에 대상의 크기·위치가 바뀌면(가입 직후 하루 요약 카드가
  // 데이터를 불러오며 커지는 경우 등) 하이라이트가 어긋남 — 지금 하이라이트 중인 대상이면 다시 측정해서 맞춤
  const handleLayout = (event: LayoutChangeEvent) => {
    onLayout?.(event);
    const { isActive, currentStepIndex, targets } = useTourStore.getState();
    if (!isActive || TOUR_STEPS[currentStepIndex]?.targetId !== id || !targets[id]) return;
    viewRef.current?.measureInWindow((x, y, width, height) => {
      if (width > 0 && height > 0) {
        useTourStore.getState().setTargetLayout(id, { x, y, width, height });
      }
    });
  };

  return (
    <View ref={viewRef} onLayout={handleLayout} {...rest}>
      {children}
    </View>
  );
}
