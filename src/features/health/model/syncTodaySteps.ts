import axios from 'axios';
import { recordStepsApi } from '../api/stepRecordApi';
import { readTodaySteps } from '../utils/healthConnect';

// 레포트 시각(마감) 이후 걸음 수를 보내면 백엔드가 주는 400 메시지(StepRecordService.recordSteps) — 정상 상황이라 에러로 치지 않음
const STEPS_DEADLINE_PASSED_MESSAGE = '지금은 걸음 수를 입력할 수 없습니다.';

function isDeadlinePassedError(error: unknown) {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 400 &&
    error.response.data?.message === STEPS_DEADLINE_PASSED_MESSAGE
  );
}

// 오늘 누적 걸음 수를 읽어 서버로 보냄(권한 확인은 호출하는 쪽에서). 어르신 홈 화면과 백그라운드 서비스가 같이 씀
export async function syncTodaySteps() {
  try {
    await recordStepsApi(await readTodaySteps());
  } catch (error) {
    if (isDeadlinePassedError(error)) return;
    console.log('[syncTodaySteps] 걸음 수 동기화 실패', error instanceof Error ? error.message : error);
  }
}
