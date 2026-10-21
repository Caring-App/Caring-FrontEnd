import { create } from 'zustand';
import { AuthLevel, UserRole } from '@shared/types';
import { clearTokens } from '@shared/api/tokenStorage';
import { clearSavedSession, saveSession } from './savedSession';

export interface UserProfile {
  memberId: number;
  name: string;
  nickname: string;
  // 로그인 응답의 권한 등급. 소셜 회원가입 응답처럼 값이 없으면 일반 회원으로 봄
  authLevel?: AuthLevel;
}

interface SessionState {
  isLoggedIn: boolean;
  role: UserRole | null;
  profile: UserProfile | null;
  linkedCode: string | null;
  // 앱 실행 직후 스플래시를 이미 보여줬는지 — 로그아웃해서 인증 화면으로 돌아올 땐 스플래시 없이 시작 화면부터.
  // 앱 실행 단위 값이라 logout()에서 초기화하지 않음
  hasShownSplash: boolean;
  // profile을 넘기지 않으면 이미 setPendingProfile로 저장해둔 값을 그대로 씀
  // (회원가입 → 온보딩 화면 → 최종 "다음" 버튼에서 로그인을 확정짓는 흐름에서 사용)
  login: (role: UserRole, profile?: UserProfile) => void;
  // 회원가입 직후 accessToken은 이미 발급됐지만, 온보딩(환영/연동) 화면이 끝나기 전까지는
  // isLoggedIn을 true로 만들지 않기 위한 중간 상태 저장용
  setPendingProfile: (role: UserRole, profile: UserProfile) => void;
  logout: () => void;
  setLinkedCode: (code: string) => void;
  markSplashShown: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  isLoggedIn: false,
  role: null,
  profile: null,
  linkedCode: null,
  hasShownSplash: false,
  login: (role, profile) => {
    set(state => ({ isLoggedIn: true, role, profile: profile ?? state.profile }));
    // 앱을 다시 켰을 때 로그인 상태를 복원할 수 있게 저장(SplashScreen → restoreSession)
    const savedProfile = get().profile;
    if (savedProfile) {
      saveSession({ role, profile: savedProfile }).catch(error => console.log('세션 저장 실패:', error));
    }
  },
  setPendingProfile: (role, profile) => set({ role, profile }),
  logout: () => {
    clearTokens().catch(error => console.log('토큰 삭제 실패:', error));
    clearSavedSession().catch(error => console.log('세션 삭제 실패:', error));
    set({ isLoggedIn: false, role: null, profile: null, linkedCode: null });
  },
  setLinkedCode: linkedCode => set({ linkedCode }),
  markSplashShown: () => set({ hasShownSplash: true }),
}));
