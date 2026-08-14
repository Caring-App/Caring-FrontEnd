import { useEffect, useState } from 'react';
import { NativeMethods } from 'react-native';
import { useTourStore } from './useTourStore';
import { TOUR_STEPS } from './tourSteps';

const SCROLL_TOP_PADDING = 96;
const SCROLL_SETTLE_FALLBACK_DELAY = 1200;
const MEASURE_RETRY_LIMIT = 5;
const TARGET_REF_RETRY_LIMIT = 10;

function getTargetNode(targetId: string) {
  const targetRef = useTourStore.getState().targetRefs[targetId];
  return targetRef?.current ?? null;
}

// 사용가이드 하이라이트 대상의 위치를 계산하는 공용 훅.
// active가 true인 쪽(홈 화면의 TourOverlay, 혹은 등록 모달 자기 자신)만 실제로 스크롤/측정을 수행함.
// scrollId가 있으면 해당 스크롤 컨테이너를 목표 위치로 스크롤한 뒤 측정하고, 없으면(등록 모달 전체
// 하이라이트처럼 화면 중앙에 고정된 경우) 스크롤 없이 다음 프레임에 바로 측정함.
export function useTourSpotlight(active: boolean) {
  const isActive = useTourStore(state => state.isActive);
  const currentStepIndex = useTourStore(state => state.currentStepIndex);
  const step = TOUR_STEPS[currentStepIndex];
  const box = useTourStore(state => (step ? state.targets[step.targetId] : undefined));
  // ready를 boolean state로 직접 들고 있으면, 스텝이 바뀐 렌더링과 그걸 감지해서 setReady(false)를
  // 부르는 effect 사이에 한 프레임(혹은 그 이상) 텀이 생겨서, 그 사이에 "다음"을 또 누르면 이전
  // 스텝의 ready=true가 아직 안 지워진 채로 새 스텝에 적용돼 하이라이트가 어긋나 보일 수 있었음
  // (연타 버그가 재발한 원인). readyStepIndex를 currentStepIndex와 비교해서 유도하면, 스텝이 바뀐
  // 그 즉시(같은 렌더링에서) ready가 false로 떨어져서 이 텀 자체가 없어짐
  const [readyStepIndex, setReadyStepIndex] = useState<number | null>(null);
  const ready = readyStepIndex === currentStepIndex;

  useEffect(() => {
    if (!active || !isActive || !step) {
      return undefined;
    }

    let cancelled = false;
    let unsubscribeSettle: (() => void) | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const cleanupWatchers = () => {
      if (unsubscribeSettle) {
        unsubscribeSettle();
        unsubscribeSettle = null;
      }
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
    };

    const startForTarget = (targetNode: NonNullable<ReturnType<typeof getTargetNode>>) => {
      // "다음"을 빠르게 연타하면 방금 막 나타난 대상(예: 그래프 섹션)이 아직 레이아웃을 안 끝낸 채로
      // 측정될 수 있음 — 그럴 땐 measureInWindow가 0x0을 돌려주는데, 이 값을 그대로 믿으면 하이라이트가
      // 어긋나 보이므로 유효한 값이 나올 때까지 몇 프레임 재시도하고, 그래도 안 되면 포기하고 진행함
      const measureAndSetReady = (attempt = 0) => {
        if (cancelled) return;
        targetNode.measureInWindow((x: number, y: number, width: number, height: number) => {
          if (cancelled) return;
          if (width > 0 && height > 0) {
            useTourStore.getState().setTargetLayout(step.targetId, { x, y, width, height });
            setReadyStepIndex(currentStepIndex);
            return;
          }
          if (attempt < MEASURE_RETRY_LIMIT) {
            requestAnimationFrame(() => measureAndSetReady(attempt + 1));
            return;
          }
          setReadyStepIndex(currentStepIndex);
        });
      };

      const scrollRef = step.scrollId ? useTourStore.getState().scrollRefs[step.scrollId] : undefined;
      const scrollNode = scrollRef?.current ?? null;
      const scrollMeasurable = scrollNode as unknown as NativeMethods | null;

      if (!scrollNode || !scrollMeasurable) {
        // 스크롤이 필요 없는 스텝(등록 모달 전체 하이라이트 등) — 모달 fade-in이 끝나길 한 프레임
        // 기다렸다가 바로 측정함
        requestAnimationFrame(() => requestAnimationFrame(measureAndSetReady));
        return;
      }

      // 실제 스크롤 애니메이션이 끝나는 시점(onMomentumScrollEnd)을 기다렸다가 측정.
      // 혹시 이벤트가 안 오는 경우를 대비해 안전장치로 일정 시간 뒤 강제 측정도 같이 걸어둠.
      const waitForSettleThenMeasure = () => {
        const scrollId = step.scrollId as string;
        const tickAtStart = useTourStore.getState().scrollSettleTicks[scrollId] ?? 0;
        unsubscribeSettle = useTourStore.subscribe(state => {
          if ((state.scrollSettleTicks[scrollId] ?? 0) !== tickAtStart) {
            cleanupWatchers();
            measureAndSetReady();
          }
        });
        fallbackTimer = setTimeout(() => {
          cleanupWatchers();
          measureAndSetReady();
        }, SCROLL_SETTLE_FALLBACK_DELAY);
      };

      targetNode.measureInWindow((targetX: number, targetY: number) => {
        if (cancelled) return;
        scrollMeasurable.measureInWindow((_scrollX: number, scrollY: number) => {
          if (cancelled) return;
          // scrollOffsets[scrollId]는 해당 ScrollView의 onScroll이 실시간으로 갱신하는 실제 스크롤 위치.
          // 자체 추정값 대신 이걸 기준으로 삼아야 이전 스텝에서의 오차가 누적되지 않음.
          const currentOffset = useTourStore.getState().scrollOffsets[step.scrollId as string] ?? 0;
          const targetYInViewport = targetY - scrollY;
          const delta = targetYInViewport - SCROLL_TOP_PADDING;
          const nextOffset = Math.max(currentOffset + delta, 0);

          if (Math.abs(nextOffset - currentOffset) < 2) {
            // 스크롤이 거의 필요 없는 경우 — onMomentumScrollEnd가 안 올 수 있으니 다음 프레임에 바로 측정
            requestAnimationFrame(() => requestAnimationFrame(measureAndSetReady));
            return;
          }

          scrollNode.scrollTo({ y: nextOffset, animated: true });
          waitForSettleThenMeasure();
        });
      });
    };

    // <TourTarget>이 아직 마운트되어 ref를 등록하기 전에(예: 방금 push된 화면, 방금 자기 자신을 연
    // 등록 모달) 이 effect가 먼저 돌 수 있음 — 그럴 땐 포기하지 말고 등록될 때까지 몇 프레임 재시도함
    const findTargetAndStart = (attempt = 0) => {
      if (cancelled) return;
      const targetNode = getTargetNode(step.targetId);
      if (targetNode) {
        startForTarget(targetNode);
        return;
      }
      if (attempt < TARGET_REF_RETRY_LIMIT) {
        requestAnimationFrame(() => findTargetAndStart(attempt + 1));
        return;
      }
      // 끝내 등록되지 않음 — 하이라이트는 못 보여줘도 최소한 다음으로는 넘어갈 수 있게 함
      setReadyStepIndex(currentStepIndex);
    };

    findTargetAndStart();

    return () => {
      cancelled = true;
      cleanupWatchers();
    };
  }, [active, isActive, currentStepIndex, step]);

  return { ready, box };
}
