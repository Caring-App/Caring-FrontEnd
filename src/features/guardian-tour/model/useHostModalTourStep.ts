import { useEffect } from 'react';
import { View } from 'react-native';
import { useTourStore } from './useTourStore';
import { TOUR_STEPS, TourStep } from './tourSteps';
import { useTourSpotlight } from './useTourSpotlight';

// 일정/복약 등록 모달처럼 사용가이드가 자기 자신을 스스로 열어서 보여줘야 하는(hostModal) 모달에서 공통으로
// 필요한 상태. "지금이 내 차례인지"와 하이라이트 위치 계산을 한 번에 묶어서 반환함.
// targetRefs로 넘긴 대상들은 여기서 대신 등록해줌 — 사용가이드가 모달을 열자마자(같은 마운트에서) 바로
// 위치를 재려고 하므로, 이 등록이 아래 useTourSpotlight보다 먼저 실행되어야 함(effect는 선언 순서대로
// 실행되므로 반드시 이 순서를 지킬 것)
export function useHostModalTourStep(
  hostModal: NonNullable<TourStep['hostModal']>,
  targetRefs: Record<string, React.RefObject<View | null>>,
) {
  useEffect(() => {
    Object.entries(targetRefs).forEach(([targetId, ref]) => {
      useTourStore.getState().registerTargetRef(targetId, ref);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tourStepIndex = useTourStore(tourState => tourState.currentStepIndex);
  const tourIsActive = useTourStore(tourState => tourState.isActive);
  const tourStep = TOUR_STEPS[tourStepIndex];
  const isTourStep = tourIsActive && tourStep?.hostModal === hostModal;
  const { ready, box } = useTourSpotlight(isTourStep);

  return { isTourStep, tourStep, tourStepIndex, ready, box };
}
