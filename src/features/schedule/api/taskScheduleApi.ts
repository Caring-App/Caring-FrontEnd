import { axiosInstance } from '@shared/api/axiosInstance';
import { TaskSchedule, TaskScheduleRequest } from '../model/taskScheduleTypes';

// [일정 목록 조회] — 보호자 전용. 어르신 1명의 일정 조회
// 주의: date를 안 보내면 전체 기간이 아니라 서버 기준 오늘 일정만 옴(백엔드 getTasksByDate 참고)
export const getTaskSchedulesApi = async (wardId: number): Promise<TaskSchedule[]> => {
  const { data } = await axiosInstance.get<TaskSchedule[]>('/api/task-schedule', { params: { wardId } });
  return data;
};

// [돌봄대상자 본인의 오늘 일정 조회] — 위 목록 조회는 보호자 전용(토큰 주인을 보호자로 보고 연동 여부를
// 검사)이라 어르신 토큰으로 부르면 400이 남. 어르신 화면은 토큰만으로 본인 일정을 주는 이 API를 써야 함.
export const getMyTodayTaskSchedulesApi = async (): Promise<TaskSchedule[]> => {
  const { data } = await axiosInstance.get<TaskSchedule[]>('/api/task-schedule/today');
  return data;
};

// [일정 등록]
export const createTaskScheduleApi = async (wardId: number, payload: TaskScheduleRequest): Promise<TaskSchedule> => {
  const { data } = await axiosInstance.post<TaskSchedule>('/api/task-schedule', payload, { params: { wardId } });
  return data;
};

// [일정 수정]
export const updateTaskScheduleApi = async (taskId: number, payload: TaskScheduleRequest): Promise<TaskSchedule> => {
  const { data } = await axiosInstance.patch<TaskSchedule>(`/api/task-schedule/${taskId}`, payload);
  return data;
};

// [일정 삭제]
export const deleteTaskScheduleApi = async (taskId: number): Promise<void> => {
  await axiosInstance.delete(`/api/task-schedule/${taskId}`);
};
