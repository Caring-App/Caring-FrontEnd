import React from 'react';
import { TourStep } from '../model/tourSteps';
import { TourTargetLayout } from '../model/useTourStore';
import { TourOverlayContent } from './TourOverlayContent';

interface TourHostOverlayProps {
  isTourStep: boolean;
  tourStep: TourStep | undefined;
  tourStepIndex: number;
  ready: boolean;
  box: TourTargetLayout | undefined;
}

// 일정/복약 등록 모달처럼 useHostModalTourStep을 쓰는 host 모달들이 그 결과를 그대로 넘겨서 쓰는 공용
// 래퍼. 두 모달에 똑같이 있던 `{isTourStep && tourStep && <TourOverlayContent .../>}` 블록을 여기로 모음
export function TourHostOverlay({ isTourStep, tourStep, tourStepIndex, ready, box }: TourHostOverlayProps) {
  if (!isTourStep || !tourStep) {
    return null;
  }

  return (
    <TourOverlayContent
      step={tourStep}
      currentStepIndex={tourStepIndex}
      showSpotlight={ready && !!box}
      ready={ready}
      box={box}
    />
  );
}
