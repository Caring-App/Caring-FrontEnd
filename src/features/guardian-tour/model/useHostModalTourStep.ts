import { useTourStore } from './useTourStore';
import { TOUR_STEPS, TourStep } from './tourSteps';
import { useTourSpotlight } from './useTourSpotlight';

// 일정/복약 등록 모달처럼 사용가이드가 자기 자신을 스스로 열어서 보여줘야 하는(hostModal) 모달에서 공통으로
// 필요한 상태. "지금이 내 차례인지"와 하이라이트 위치 계산을 한 번에 묶어서 반환함
export function useHostModalTourStep(hostModal: NonNullable<TourStep['hostModal']>) {
  const tourStepIndex = useTourStore(tourState => tourState.currentStepIndex);
  const tourIsActive = useTourStore(tourState => tourState.isActive);
  const tourStep = TOUR_STEPS[tourStepIndex];
  const isTourStep = tourIsActive && tourStep?.hostModal === hostModal;
  const { ready, box } = useTourSpotlight(isTourStep);

  return { isTourStep, tourStep, tourStepIndex, ready, box };
}
