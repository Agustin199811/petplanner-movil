import api from './api';
import { Category, ApiResponse } from '../types';

export class CategoryService {

    static async getCategories(): Promise<Category[]> {
        const response = await api.get<ApiResponse<Category[]>>('/categories');
        return response.data.data;
    }

    static async createCategory(categoryData: {
        name: string;
        color: string;
        icon: string;
        pointsReward?: number;
    }): Promise<Category> {
        const response = await api.post<ApiResponse<Category>>('/categories', categoryData);
        return response.data.data;
    }

    static async updateCategory(categoryId: string, categoryData: Partial<{
        name: string;
        color: string;
        icon: string;
        pointsReward: number;
    }>): Promise<Category> {
        const response = await api.put<ApiResponse<Category>>(`/categories/${categoryId}`, categoryData);
        return response.data.data;
    }

    static async deleteCategory(categoryId: string): Promise<void> {
        await api.delete(`/categories/${categoryId}`);
    }
}