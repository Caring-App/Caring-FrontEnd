import EncryptedStorage from 'react-native-encrypted-storage';
import type { UserProfile } from './useSessionStore';
import type { UserRole } from '@shared/types';

// 앱을 다시 켰을 때 로그인 상태를 복원하기 위해 저장해 두는 세션 정보(토큰과 같은 암호화 저장소).
// 토큰만으로는 역할(보호자/어르신)과 회원 정보를 알 수 없어서 로그인할 때 같이 저장함
// TODO(백엔드): 내 정보 조회 API(GET /api/member/me)가 생기면 복원 시 그 응답으로 최신 정보를 받아올 것
export interface SavedSession {
  role: UserRole;
  profile: UserProfile;
}

const SESSION_KEY = 'session';

export const saveSession = (session: SavedSession) => EncryptedStorage.setItem(SESSION_KEY, JSON.stringify(session));

export async function getSavedSession(): Promise<SavedSession | null> {
  const raw = await EncryptedStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedSession;
  } catch {
    return null;
  }
}

export const clearSavedSession = () => EncryptedStorage.removeItem(SESSION_KEY);
