// Tipos de usuario
export interface User {
    id: string;
    username: string;
    email: string;
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
}

// Tipos de mascota
export enum PetType {
    DOG = "dog",
    CAT = "cat",
    RABBIT = "rabbit",
    BIRD = "bird",
}

export enum PetMood {
    VERY_HAPPY = "very_happy",
    HAPPY = "happy",
    NEUTRAL = "neutral",
    SAD = "sad",
    VERY_SAD = "very_sad",
}

export interface Pet {
    id: string;
    name: string;
    type: PetType;
    happiness: number;
    health: number;
    energy: number;
    level: number;
    experience: number;
    currentMood: PetMood;
    lastFed: string;
    lastPlayed: string;
    isAway: boolean;
}

// Tipos de tareas
export enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
}

export enum TaskFrequency {
    ONCE = "once",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    frequency: TaskFrequency;
    dueDate?: string;
    isCompleted: boolean;
    completedAt?: string;
    pointsReward: number;
    category: Category;
    createdAt: string;
    updatedAt: string;
}

// Tipos de categorías
export interface Category {
    id: string;
    name: string;
    color: string;
    icon: string;
    pointsReward: number;
}

// Tipos de progreso
export interface UserProgress {
    id: string;
    totalTasksCompleted: number;
    tasksCompletedToday: number;
    tasksCompletedThisWeek: number;
    tasksCompletedThisMonth: number;
    weeklyProgress: Record<string, number>;
    categoryStats: Record<string, number>;
    lastUpdated: string;
}

// Tipos de estadísticas
export interface TaskStats {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionRate: number;
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
    progress: UserProgress;
}

// Tipos de respuesta de API
export interface ApiResponse<T> {
    message?: string;
    data: T;
}

export interface AuthResponse {
    user: User;
    pet: Pet | null;
    progress?: UserProgress;
    token: string;
}

// Tipos de formularios
export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    petName: string;
    petType: PetType;
}

export interface TaskForm {
    title: string;
    description?: string;
    priority: TaskPriority;
    frequency: TaskFrequency;
    dueDate?: string;
    categoryId: string;
    pointsReward?: number;
}

// Tipos de estado global
export interface AppState {
    user: User | null;
    pet: Pet | null;
    tasks: Task[];
    categories: Category[];
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}