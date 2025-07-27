import { create } from 'zustand';
import { User, Pet, Task, Category, TaskStats } from '../types';
import { AuthService } from '../services/authService';
import { TaskService } from '../services/taskService';
import { PetService } from '../services/petService';
import { CategoryService } from '../services/categoryService';



interface AppStore {
    // Estado
    user: User | null;
    pet: Pet | null;
    tasks: Task[];
    todayTasks: Task[];
    categories: Category[];
    taskStats: TaskStats | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Acciones de autenticación
    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    checkAuth: (showLoading?: boolean) => void;

    // Acciones de tareas
    fetchTasks: (filters?: any) => Promise<void>;
    fetchTodayTasks: () => Promise<void>;
    createTask: (taskData: any) => Promise<void>;
    updateTask: (taskId: string, taskData: any) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    completeTask: (taskId: string) => Promise<{ pointsEarned: number; wasOnTime: boolean }>;
    fetchTaskStats: () => Promise<void>;

    // Acciones de mascota
    fetchPetStatus: () => Promise<void>;
    feedPet: () => Promise<void>;
    playWithPet: () => Promise<void>;
    recoverPet: () => Promise<void>;

    // Acciones de categorías
    fetchCategories: () => Promise<void>;

    // Utilidades
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
    // Estado inicial
    user: null,
    pet: null,
    tasks: [],
    todayTasks: [],
    categories: [],
    taskStats: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Acciones de autenticación
    login: async (email: string, password: string) => {
        console.log("login iniciado");
        try {
            set({ isLoading: true, error: null });
            const response = await AuthService.login({ email, password });
            console.log("login exitoso", response);

            set({
                user: response.user,
                pet: response.pet,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error: any) {
            console.log("login error", error);
            set({
                error: error.response?.data?.error || "Error al iniciar sesión",
                isLoading: false,
            });
            throw error;
        }
    },
    register: async (userData: any) => {
        console.log("register iniciado");
        try {
            set({ isLoading: true, error: null });
            const response = await AuthService.register(userData);
            console.log("register exitoso", response);

            set({
                user: response.user,
                pet: response.pet,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error: any) {
            console.log("register error", error);
            set({
                error: error.response?.data?.error || "Error al registrarse",
                isLoading: false,
            });
            throw error;
        }
    },



    // appStore.ts - en la acción logout
    logout: () => {
        AuthService.logout();
        set({
            user: null,
            pet: null,
            tasks: [],
            todayTasks: [],
            taskStats: null,
            categories: [],
            isAuthenticated: false,
            error: null,
            isLoading: false,
        });
    },


    // En appStore.ts, la acción logout está bien, pero puedes mejorar el checkAuth:
    checkAuth: (showLoading: boolean = false) => {
        if (showLoading) set({ isLoading: true });
        const isAuth = AuthService.isAuthenticated();
        const user = AuthService.getCurrentUser();
        set({
            isAuthenticated: isAuth,
            user: user,
            isLoading: false,
        });
    },




    // Acciones de tareas
    fetchTasks: async (filters?: any) => {
        try {
            set({ isLoading: true });
            const tasks = await TaskService.getTasks(filters);
            set({ tasks, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error al cargar tareas',
                isLoading: false,
            });
        }
    },

    fetchTodayTasks: async () => {
        try {
            const todayTasks = await TaskService.getTodayTasks();
            set({ todayTasks });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error al cargar tareas de hoy',
            });
        }
    },

    createTask: async (taskData: any) => {
        try {
            set({ isLoading: true });
            const newTask = await TaskService.createTask(taskData);
            const { tasks } = get();
            set({
                tasks: [...tasks, newTask],
                isLoading: false,
            });

            // Actualizar tareas de hoy si es relevante
            get().fetchTodayTasks();
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error al crear tarea',
                isLoading: false,
            });
            throw error;
        }
    },

    updateTask: async (taskId: string, taskData: any) => {
        try {
            const updatedTask = await TaskService.updateTask(taskId, taskData);
            const { tasks } = get();

            set({
                tasks: tasks.map(task =>
                    task.id === taskId ? updatedTask : task
                ),
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error al actualizar tarea',
            });
            throw error;
        }
    },

    deleteTask: async (taskId: string) => {
        try {
            await TaskService.deleteTask(taskId);
            const { tasks, todayTasks } = get();

            set({
                tasks: tasks.filter(task => task.id !== taskId),
                todayTasks: todayTasks.filter(task => task.id !== taskId),
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error al eliminar tarea',
            });
            throw error;
        }
    },

    completeTask: async (taskId: string) => {
        try {
            const result = await TaskService.completeTask(taskId);
            const { tasks, todayTasks, user } = get();

            // Actualizar la tarea en el estado
            const updatedTasks = tasks.map(task =>
                task.id === taskId ? { ...task, isCompleted: true } : task
            );
            const updatedTodayTasks = todayTasks.map(task =>
                task.id === taskId ? { ...task, isCompleted: true } : task
            );

            // Actualizar puntos del usuario
            const updatedUser = user ? {
                ...user,
                totalPoints: user.totalPoints + result.pointsEarned
            } : null;

            set({
                tasks: updatedTasks,
                todayTasks: updatedTodayTasks,
                user: updatedUser,
            });

            // Actualizar estadísticas y mascota
            get().fetchTaskStats();
            get().fetchPetStatus();

            return result;
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error al completar tarea',
            });
            throw error;
        }
    },

    fetchTaskStats: async () => {
        try {
            const stats = await TaskService.getTaskStats();
            set({ taskStats: stats });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error al cargar estadísticas',
            });
        }
    },

    // Acciones de mascota
    fetchPetStatus: async () => {
        try {
            const pet = await PetService.getPetStatus();
            set({ pet });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error al cargar mascota',
            });
        }
    },

    feedPet: async () => {
        try {
            const pet = await PetService.feedPet();
            set({ pet });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error al alimentar mascota',
            });
            throw error;
        }
    },

    playWithPet: async () => {
        try {
            const pet = await PetService.playWithPet();
            set({ pet });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error al jugar con mascota',
            });
            throw error;
        }
    },

    recoverPet: async () => {
        try {
            const pet = await PetService.recoverPet();
            set({ pet });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error al recuperar mascota',
            });
            throw error;
        }
    },

    // Acciones de categorías
    fetchCategories: async () => {
        try {
            const categories = await CategoryService.getCategories();
            set({ categories });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error al cargar categorías',
            });
        }
    },

    // Utilidades
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
}));