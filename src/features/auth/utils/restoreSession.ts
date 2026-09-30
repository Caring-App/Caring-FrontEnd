import { clearTokens, getAccessToken } from '@shared/api';
import { isRefreshRejected, refreshAccessToken } from '@shared/api/axiosInstance';
import { clearSavedSession, getSavedSession, SavedSession } from '@shared/store/savedSession';

// 앱 시작(스플래시) 때 이전 로그인 상태를 복원 — 복원할 세션이면 반환하고, 아니면 null(로그인 화면으로).
// 어르신은 매번 다시 로그인하기 어렵고, 로그인 전까지는 위치 공유도 멈추기 때문에 자동 로그인이 필요함.
export async function restoreSession(): Promise<SavedSession | null> {
  const session = await getSavedSession();
  if (!session || !(await getAccessToken())) {
    // 저장된 세션 없이 남은 토큰(앱을 강제 종료하는 등)은 로그인·회원가입 요청에 실려 나가지 않게 지움
    await Promise.all([clearTokens(), clearSavedSession()]);
    return null;
  }
  try {
    // 저장된 accessToken이 만료됐을 수 있어 미리 새로 발급받아 둠 — refreshToken까지 만료됐으면 여기서 걸러짐
    await refreshAccessToken();
  } catch (error) {
    if (isRefreshRejected(error)) {
      await Promise.all([clearTokens(), clearSavedSession()]);
      return null;
    }
    // 인터넷이 잠깐 안 되는 등 재발급 자체를 못 한 경우엔 로그인 상태는 복원하고, 이후 요청에서 다시 재발급을 시도함
    console.log('세션 복원 중 토큰 재발급 실패(네트워크):', error instanceof Error ? error.message : error);
  }
  return session;
}
