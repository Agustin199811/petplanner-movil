import api from './api';
import { Task, TaskForm, TaskStats, TaskPriority, TaskFrequency, ApiResponse } from '../types';

export class TaskService {

    static async getTasks(filters?: {
        isCompleted?: boolean;
        frequency?: TaskFrequency;
        priority?: TaskPriority;
        categoryId?: string;
    }): Promise<Task[]> {
        const params = new URLSearchParams();

        if (filters?.isCompleted !== undefined) {
            params.append('isCompleted', filters.isCompleted.toString());
        }
        if (filters?.frequency) {
            params.append('frequency', filters.frequency);
        }
        if (filters?.priority) {
            params.append('priority', filters.priority);
        }
        if (filters?.categoryId) {
            params.append('categoryId', filters.categoryId);
        }

        const response = await api.get<ApiResponse<Task[]>>(`/tasks?${params.toString()}`);
        return response.data.data;
    }

    static async getTodayTasks(): Promise<Task[]> {
        const response = await api.get<ApiResponse<Task[]>>('/tasks/today');
        return response.data.data;
    }

    static async createTask(taskData: TaskForm): Promise<Task> {
        const response = await api.post<ApiResponse<Task>>('/tasks', taskData);
        return response.data.data;
    }

    static async updateTask(taskId: string, taskData: Partial<TaskForm>): Promise<Task> {
        const response = await api.put<ApiResponse<Task>>(`/tasks/${taskId}`, taskData);
        return response.data.data;
    }

    static async deleteTask(taskId: string): Promise<void> {
        await api.delete(`/tasks/${taskId}`);
    }

    static async completeTask(taskId: string): Promise<{ task: Task; pointsEarned: number; wasOnTime: boolean }> {
        const response = await api.post<ApiResponse<{ task: Task; pointsEarned: number; wasOnTime: boolean }>>(`/tasks/${taskId}/complete`);
        return response.data.data;
    }

    static async getTaskStats(): Promise<TaskStats> {
        const response = await api.get<ApiResponse<TaskStats>>('/tasks/stats');
        return response.data.data;
    }
}