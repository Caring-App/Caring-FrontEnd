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
  // ScrollView의 onMomentumScrollEnd에서 증가시키는 카운터 — "스크롤 애니메이션이 실제로 끝났다"는 신호로 사용
  scrollSettleTick: number;
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
  registerScrollRef: (id: string, ref: React.RefObject<ScrollView | null>) => void;
  setTargetLayout: (id: string, layout: TourTargetLayout) => void;
  notifyScrollSettled: () => void;
  setScrollOffset: (scrollId: string, y: number) => void;
}

export const useTourStore = create<TourState>((set, get) => ({
  shouldAutoStart: false,
  isActive: false,
  currentStepIndex: 0,
  targets: {},
  targetRefs: {},
  scrollRefs: {},
  scrollSettleTick: 0,
  scrollOffsets: {},
  requestAutoStart: () => set({ shouldAutoStart: true }),
  start: () => set({ isActive: true, currentStepIndex: 0, shouldAutoStart: false }),
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
  registerScrollRef: (id, ref) =>
    set(state => ({ scrollRefs: { ...state.scrollRefs, [id]: ref } })),
  setTargetLayout: (id, layout) =>
    set(state => ({ targets: { ...state.targets, [id]: layout } })),
  notifyScrollSettled: () => set(state => ({ scrollSettleTick: state.scrollSettleTick + 1 })),
  setScrollOffset: (scrollId, y) =>
    set(state => ({ scrollOffsets: { ...state.scrollOffsets, [scrollId]: y } })),
}));
