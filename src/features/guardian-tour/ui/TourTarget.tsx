import React, { useEffect, useRef } from 'react';
import { View, ViewProps } from 'react-native';
import { useTourStore } from '../model/useTourStore';

interface TourTargetProps extends ViewProps {
  id: string;
  children: React.ReactNode;
}

// 사용가이드 투어가 하이라이트할 수 있는 영역을 표시하는 래퍼.
// 화면 레이아웃/모양은 전혀 바꾸지 않고, 자기 자신의 ref를 투어 스토어에 등록만 함.
export function TourTarget({ id, children, ...rest }: TourTargetProps) {
  const viewRef = useRef<View>(null);

  useEffect(() => {
    useTourStore.getState().registerTargetRef(id, viewRef);
  }, [id]);

  return (
    <View ref={viewRef} {...rest}>
      {children}
    </View>
  );
}
