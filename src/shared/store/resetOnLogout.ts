import type { StoreApi } from 'zustand';
import { useSessionStore } from './useSessionStore';

// zustand store는 로그인 세션과 무관하게 살아있는 전역 싱글턴이라 로그아웃해도 저절로 안 비워짐 —
// 그대로 두면 이전 계정(보호자↔어르신 전환 포함)에서 받아온 데이터가 다음 로그인 때도 남아서, 조회가
// 실패해도 예전 값이 정상처럼 보이는 문제가 생김. 로그아웃 순간 store를 생성 시점 초기값으로 되돌림.
export function resetOnLogout<T>(store: Pick<StoreApi<T>, 'setState' | 'getInitialState'>) {
  useSessionStore.subscribe((state, prevState) => {
    if (prevState.isLoggedIn && !state.isLoggedIn) {
      store.setState(store.getInitialState(), true);
    }
  });
}
