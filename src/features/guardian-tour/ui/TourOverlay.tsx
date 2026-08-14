import React from 'react';
import { Modal } from 'react-native';
import { TOUR_STEPS, TourStep } from '../model/tourSteps';
import { useTourStore } from '../model/useTourStore';
import { useTourSpotlight } from '../model/useTourSpotlight';
import { TourOverlayContent } from './TourOverlayContent';

interface TourOverlayProps {
  // 이 오버레이가 속한 화면. 생략하면 보호자 홈(Home 탭)을 의미함
  screen?: NonNullable<TourStep['screen']>;
}

// 화면별 사용가이드 오버레이. 스텝의 대상이 이미 열려있는 등록 모달(hostModal) 안에 있는 경우엔
// 여기서 그리지 않고 그 모달이 스스로 자기 Modal 안에 그림 — 두 개의 네이티브 Modal이 동시에
// 떠서 쌓이는 순서가 꼬이는 걸 피하기 위함. 또한 현재 스텝이 이 화면 소유가 아니면 아무것도 그리지 않음
// (여러 화면에 각각 <TourOverlay>가 있어도 한 번에 하나만 실제로 그려지도록)
export function TourOverlay({ screen }: TourOverlayProps) {
  const isActive = useTourStore(state => state.isActive);
  const currentStepIndex = useTourStore(state => state.currentStepIndex);
  const step = TOUR_STEPS[currentStepIndex];
  const ownedHere = !!step && step.screen === screen && !step.hostModal;

  const { ready, box } = useTourSpotlight(isActive && ownedHere);

  if (!isActive || !step || !ownedHere) {
    return null;
  }

  const handleClose = () => useTourStore.getState().close();

  return (
    // statusBarTranslucent를 주면 모달 자체 창이 상태바 아래(물리적 화면 맨 위)부터 그려지는 반면,
    // 하이라이트 좌표는 일반 화면 트리에서 measureInWindow로 잰 값(상태바 아래 창 기준)이라 상태바 높이만큼
    // 어긋난다. 두 좌표계를 일치시키기 위해 statusBarTranslucent를 빼서 모달도 같은 창 기준으로 그리게 함.
    <Modal visible transparent animationType="fade" onRequestClose={handleClose}>
      <TourOverlayContent
        step={step}
        currentStepIndex={currentStepIndex}
        showSpotlight={ready && !!box}
        ready={ready}
        box={box}
      />
    </Modal>
  );
}
