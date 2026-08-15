import { create } from 'zustand';
import { ScrollView, View } from 'react-native';

export interface TourTargetLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TourState {
  // 회원가입 완료 직후 보호자 홈 진입 시 1회 자동 시작하기 위한 플래그
  shouldAutoStart: boolean;
  isActive: boolean;
  currentStepIndex: number;
  // 하이라이트 대상의 화면상 좌표 (스포트라이트 그리기용)
  targets: Record<string, TourTargetLayout>;
  // <TourTarget id="..."> 가 등록해두는 자기 자신의 네이티브 ref (스크롤 위치 계산용)
  targetRefs: Record<string, React.RefObject<View | null>>;
  // 스텝별로 스크롤이 필요한 컨테이너(홈 ScrollView, 일정/복약 등록 모달의 내부 ScrollView 등)의 ref.
  // TourStep.scrollId로 조회함 — 등록 모달처럼 화면 중앙에 고정되어 스크롤이 필요 없는 스텝은 등록하지 않아도 됨
  scrollRefs: Record<string, React.RefObject<ScrollView | null>>;
  // 각 스크롤 컨테이너(scrollId)의 onMomentumScrollEnd에서 증가시키는 카운터 — "그 컨테이너의 스크롤
  // 애니메이션이 실제로 끝났다"는 신호로 사용. 컨테이너가 여러 개라 하나로 합치면, 투어가 스크롤 중인
  // 컨테이너와 무관한 다른 화면의 스크롤이 우연히 같은 타이밍에 끝나도 "정착됨"으로 오판할 수 있어
  // scrollOffsets와 마찬가지로 scrollId별로 따로 둠
  scrollSettleTicks: Record<string, number>;
  // 각 스크롤 컨테이너(scrollId)의 onScroll에서 실시간으로 갱신하는 실제 스크롤 위치.
  // 오버레이가 목표 오프셋을 계산할 때 자체적으로 추정한 값 대신 이 값을 기준으로 삼아야
  // 스크롤 위치와 어긋나지 않음. 컨테이너가 여러 개(홈 ScrollView, 등록 모달 내부 ScrollView)이므로
  // scrollId별로 따로 들고 있음
  scrollOffsets: Record<string, number>;
  requestAutoStart: () => void;
  start: () => void;
  next: (totalSteps: number) => void;
  close: () => void;
  registerTargetRef: (id: string, ref: React.RefObject<View | null>) => void;
  // TourTarget이 언마운트될 때 자기 자신의 등록을 지움. 같은 id로 다른 컴포넌트가 먼저 새로 등록해둔
  // 상태를 실수로 덮어쓰지 않도록, ref가 여전히 자기 자신일 때만 지움
  unregisterTargetRef: (id: string, ref: React.RefObject<View | null>) => void;
  registerScrollRef: (id: string, ref: React.RefObject<ScrollView | null>) => void;
  setTargetLayout: (id: string, layout: TourTargetLayout) => void;
  notifyScrollSettled: (scrollId: string) => void;
  setScrollOffset: (scrollId: string, y: number) => void;
}

export const useTourStore = create<TourState>((set, get) => ({
  shouldAutoStart: false,
  isActive: false,
  currentStepIndex: 0,
  targets: {},
  targetRefs: {},
  scrollRefs: {},
  scrollSettleTicks: {},
  scrollOffsets: {},
  requestAutoStart: () => set({ shouldAutoStart: true }),
  // targets를 같이 리셋해야 함 — 안 하면 재실행(예: 마이페이지 "다시보기")에서 측정이 실패했을 때
  // 이전 실행에서 남은 stale한 좌표로 하이라이트가 그려질 수 있음
  start: () => set({ isActive: true, currentStepIndex: 0, shouldAutoStart: false, targets: {} }),
  next: (totalSteps: number) => {
    const nextIndex = get().currentStepIndex + 1;
    if (nextIndex >= totalSteps) {
      set({ isActive: false });
    } else {
      set({ currentStepIndex: nextIndex });
    }
  },
  close: () => set({ isActive: false }),
  registerTargetRef: (id, ref) =>
    set(state => ({ targetRefs: { ...state.targetRefs, [id]: ref } })),
  unregisterTargetRef: (id, ref) =>
    set(state => {
      if (state.targetRefs[id] !== ref) {
        return state;
      }
      const nextTargetRefs = { ...state.targetRefs };
      delete nextTargetRefs[id];
      return { targetRefs: nextTargetRefs };
    }),
  registerScrollRef: (id, ref) =>
    set(state => ({ scrollRefs: { ...state.scrollRefs, [id]: ref } })),
  setTargetLayout: (id, layout) =>
    set(state => ({ targets: { ...state.targets, [id]: layout } })),
  notifyScrollSettled: scrollId =>
    set(state => ({
      scrollSettleTicks: { ...state.scrollSettleTicks, [scrollId]: (state.scrollSettleTicks[scrollId] ?? 0) + 1 },
    })),
  setScrollOffset: (scrollId, y) =>
    set(state => ({ scrollOffsets: { ...state.scrollOffsets, [scrollId]: y } })),
}));
