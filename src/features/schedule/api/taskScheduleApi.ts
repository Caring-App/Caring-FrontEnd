import { axiosInstance } from '@shared/api/axiosInstance';
import { TaskSchedule, TaskScheduleRequest } from '../model/taskScheduleTypes';

// [일정 목록 조회] — 어르신 1명의 등록된 일정 전체 조회 (date는 옵션이라 특정 날짜로 좁히지 않고 항상 전체 기간 조회)
export const getTaskSchedulesApi = async (wardId: number): Promise<TaskSchedule[]> => {
  const { data } = await axiosInstance.get<TaskSchedule[]>('/api/task-schedule', { params: { wardId } });
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
