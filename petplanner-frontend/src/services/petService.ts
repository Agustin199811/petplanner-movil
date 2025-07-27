import api from './api';
import { Pet, ApiResponse } from '../types';

export class PetService {

    static async getPetStatus(): Promise<Pet> {
        const response = await api.get<ApiResponse<Pet>>('/pet/status');
        return response.data.data;
    }

    static async feedPet(): Promise<Pet> {
        const response = await api.post<ApiResponse<Pet>>('/pet/feed');
        return response.data.data;
    }

    static async playWithPet(): Promise<Pet> {
        const response = await api.post<ApiResponse<Pet>>('/pet/play');
        return response.data.data;
    }

    static async recoverPet(): Promise<Pet> {
        const response = await api.post<ApiResponse<Pet>>('/pet/recover');
        return response.data.data;
    }
}