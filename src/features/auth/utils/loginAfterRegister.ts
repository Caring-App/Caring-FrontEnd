import { loginApi } from '@features/auth/api';
import { setTokens } from '@shared/api';
import { useSessionStore } from '@shared/store/useSessionStore';
import { UserRole } from '@shared/types';

// 회원가입 응답에는 토큰이 없으므로 방금 만든 계정으로 바로 로그인해 토큰을 발급받는 공통 후처리.
// 계정은 이미 생성된 뒤라 여기서 실패해도 "회원가입 실패"가 아니므로, 실패를 그대로 던져서
// 호출부(useSignUp/useWardSignUp)가 회원가입 실패와 다른 메시지로 안내할 수 있게 함.
export async function loginAfterRegister(phone: string, password: string, role: UserRole) {
  const loginResult = await loginApi({ phone, password });
  await setTokens(loginResult.accessToken, loginResult.refreshToken);
  useSessionStore.getState().setPendingProfile(role, {
    memberId: loginResult.memberId,
    name: loginResult.name,
    nickname: loginResult.nickname,
  });
}
