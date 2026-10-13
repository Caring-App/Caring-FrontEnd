import { axiosInstance } from '@shared/api/axiosInstance';
import { SLOW_REQUEST_TIMEOUT_MS } from '@shared/api/timeouts';
import { TaskSchedule, TaskScheduleRequest } from '../model/taskScheduleTypes';

// [일정 목록 조회] — 보호자 전용. 어르신 1명의 startDate~endDate(yyyy-MM-dd, 양끝 포함) 일정 조회
// (startDate/endDate는 백엔드에 요청해 추가된 파라미터 — 2026-10-13 스웨거에서 이름 확인)
export const getTaskSchedulesApi = async (
  wardId: number,
  range: { startDate: string; endDate: string },
): Promise<TaskSchedule[]> => {
  const { data } = await axiosInstance.get<TaskSchedule[]>('/api/task-schedule', { params: { wardId, ...range } });
  return data;
};

// [돌봄대상자 본인의 오늘 일정 조회] — 위 목록 조회는 보호자 전용(토큰 주인을 보호자로 보고 연동 여부를
// 검사)이라 어르신 토큰으로 부르면 400이 남. 어르신 화면은 토큰만으로 본인 일정을 주는 이 API를 써야 함.
export const getMyTodayTaskSchedulesApi = async (): Promise<TaskSchedule[]> => {
  const { data } = await axiosInstance.get<TaskSchedule[]>('/api/task-schedule/today');
  return data;
};

// [일정 등록] — 기본 알림음(TTS)이면 서버가 저장하면서 음성 파일을 만들어 올려서 5초를 넘기기 쉬움
export const createTaskScheduleApi = async (wardId: number, payload: TaskScheduleRequest): Promise<TaskSchedule> => {
  const { data } = await axiosInstance.post<TaskSchedule>('/api/task-schedule', payload, {
    params: { wardId },
    timeout: SLOW_REQUEST_TIMEOUT_MS,
  });
  return data;
};

// [일정 수정] — 등록과 같은 이유로 타임아웃을 늘림
export const updateTaskScheduleApi = async (taskId: number, payload: TaskScheduleRequest): Promise<TaskSchedule> => {
  const { data } = await axiosInstance.patch<TaskSchedule>(`/api/task-schedule/${taskId}`, payload, {
    timeout: SLOW_REQUEST_TIMEOUT_MS,
  });
  return data;
};

// [일정 삭제]
export const deleteTaskScheduleApi = async (taskId: number): Promise<void> => {
  await axiosInstance.delete(`/api/task-schedule/${taskId}`);
};
