import api from './api';
import { LoginForm, RegisterForm, AuthResponse, User, ApiResponse } from '../types';

export class AuthService {

    static async login(credentials: LoginForm): Promise<AuthResponse> {
        try {
            const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
            const { token, user, pet, progress } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return response.data.data;
        } catch (error) {
            console.error("AuthService.login error:", error);
            throw error;  // Importante re-lanzar para que el store detecte el error
        }
    }


    static async register(userData: RegisterForm): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);

        // Guardar token y datos del usuario
        const { token, user, pet, progress } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return response.data.data;
    }

    static async getProfile(): Promise<{ user: User; pet: any; progress: any }> {
        const response = await api.get('/auth/profile');
        return response.data;
    }

    static logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    static isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        return !!token;
    }

    static getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
}