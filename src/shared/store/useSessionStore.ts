import { create } from 'zustand';
import { UserRole } from '@shared/types';
import { clearTokens } from '@shared/api/tokenStorage';

interface UserProfile {
  memberId: number;
  name: string;
  nickname: string;
}

interface SessionState {
  isLoggedIn: boolean;
  role: UserRole | null;
  profile: UserProfile | null;
  linkedCode: string | null;
  isLogoutConfirmVisible: boolean;
  // profile을 넘기지 않으면 이미 setPendingProfile로 저장해둔 값을 그대로 씀
  // (회원가입 → 온보딩 화면 → 최종 "다음" 버튼에서 로그인을 확정짓는 흐름에서 사용)
  login: (role: UserRole, profile?: UserProfile) => void;
  // 회원가입 직후 accessToken은 이미 발급됐지만, 온보딩(환영/연동) 화면이 끝나기 전까지는
  // isLoggedIn을 true로 만들지 않기 위한 중간 상태 저장용
  setPendingProfile: (role: UserRole, profile: UserProfile) => void;
  logout: () => void;
  setLinkedCode: (code: string) => void;
  requestLogout: () => void;
  cancelLogout: () => void;
}

export const useSessionStore = create<SessionState>(set => ({
  isLoggedIn: false,
  role: null,
  profile: null,
  linkedCode: null,
  isLogoutConfirmVisible: false,
  login: (role, profile) => set(state => ({ isLoggedIn: true, role, profile: profile ?? state.profile })),
  setPendingProfile: (role, profile) => set({ role, profile }),
  logout: () => {
    clearTokens().catch(error => console.error('토큰 삭제 실패:', error));
    set({ isLoggedIn: false, role: null, profile: null, linkedCode: null, isLogoutConfirmVisible: false });
  },
  setLinkedCode: linkedCode => set({ linkedCode }),
  requestLogout: () => set({ isLogoutConfirmVisible: true }),
  cancelLogout: () => set({ isLogoutConfirmVisible: false }),
}));
