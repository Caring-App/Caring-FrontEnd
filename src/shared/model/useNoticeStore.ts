import { create } from 'zustand';

// 안내 모달 버튼 — Alert.alert의 버튼과 같은 모양이라 그대로 옮겨 쓸 수 있음.
// 'cancel'은 회색(취소), 그 외는 주황(확인/실행) 버튼으로 그림
export interface NoticeButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

export interface Notice {
  id: number;
  title: string;
  message?: string;
  buttons: NoticeButton[];
  // 같은 key의 안내가 이미 떠 있거나 대기 중이면 새로 쌓지 않음(조회 실패처럼 한꺼번에 여러 번 생기는 안내용)
  key?: string;
}

interface NoticeState {
  // 한 번에 하나씩 보여주고, 닫으면 다음 안내를 보여줌
  queue: Notice[];
  push: (notice: Omit<Notice, 'id'>) => void;
  // 버튼을 누르거나 바깥을 눌러 닫을 때 — 눌린 버튼의 onPress는 모달이 닫힌 뒤 실행
  dismiss: (button?: NoticeButton) => void;
}

let nextId = 1;
// key별로 마지막으로 닫힌 시각 — 같은 조회 실패 안내가 화면을 오갈 때마다 연달아 뜨지 않게 잠시 쉼
const dismissedAtByKey: Record<string, number> = {};
const SAME_KEY_COOLDOWN_MS = 30 * 1000;

export const useNoticeStore = create<NoticeState>((set, get) => ({
  queue: [],
  push: notice => {
    if (notice.key) {
      if (get().queue.some(item => item.key === notice.key)) return;
      const dismissedAt = dismissedAtByKey[notice.key];
      if (dismissedAt && Date.now() - dismissedAt < SAME_KEY_COOLDOWN_MS) return;
    }
    set(state => ({ queue: [...state.queue, { ...notice, id: nextId++ }] }));
  },
  dismiss: button => {
    const [current, ...rest] = get().queue;
    if (!current) return;
    if (current.key) dismissedAtByKey[current.key] = Date.now();
    set({ queue: rest });
    button?.onPress?.();
  },
}));

const DEFAULT_BUTTONS: NoticeButton[] = [{ text: '확인' }];

// Alert.alert(title, message, buttons)와 같은 모양의 앱 안내 모달. title이 비어 있으면 message를 제목 자리에 보여줌
export function showNotice(title: string, message?: string, buttons: NoticeButton[] = DEFAULT_BUTTONS) {
  const hasTitle = title.trim().length > 0;
  useNoticeStore.getState().push({
    title: hasTitle ? title : message ?? '',
    message: hasTitle ? message : undefined,
    buttons: buttons.length > 0 ? buttons : DEFAULT_BUTTONS,
  });
}

// 화면에 들어올 때 불러오는 조회가 실패했을 때 — 여러 조회가 한꺼번에 실패해도(서버 꺼짐·인터넷 끊김) 한 번만 알림
export function notifyLoadFailed() {
  useNoticeStore.getState().push({
    key: 'load-failed',
    title: '정보를 불러오지 못했어요',
    message: '인터넷 연결을 확인하고 잠시 후 다시 시도해 주세요.',
    buttons: DEFAULT_BUTTONS,
  });
}
