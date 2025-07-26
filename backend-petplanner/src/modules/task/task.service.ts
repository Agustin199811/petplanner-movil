import { TypeOrmConfig } from "../../common/config/database.config";
import { Category } from "../category/entity/category.entity";
import { PetService } from "../pet/pet.service";
import { TaskCompletion } from "../taskcompletion/entity/taskcompletion.entity";
import { User } from "../user/entity/user.entity";
import { UserProgress } from "../userprogress/entity/userprogress.entity";
import { Task } from "./entity/task.entity";
import { TaskFrequency, TaskPriority } from "./enum/task.enum";

export class TaskService {
    private taskRepository = TypeOrmConfig.getRepository(Task);
    private completionRepository = TypeOrmConfig.getRepository(TaskCompletion);
    private userRepository = TypeOrmConfig.getRepository(User);
    private progressRepository = TypeOrmConfig.getRepository(UserProgress);
    private categoryRepository = TypeOrmConfig.getRepository(Category);
    private petService = new PetService();

    async createTask(userId: string, taskData: {
        title: string;
        description?: string;
        priority: TaskPriority;
        frequency: TaskFrequency;
        dueDate?: Date;
        categoryId: string;
        pointsReward?: number;
    }) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const category = await this.categoryRepository.findOne({
            where: { id: taskData.categoryId }
        });

        if (!user || !category) {
            throw new Error("Usuario o categoría no encontrada");
        }

        const task = this.taskRepository.create({
            ...taskData,
            user,
            category,
            pointsReward: taskData.pointsReward || category.pointsReward,
        });

        return await this.taskRepository.save(task);
    }

    async getUserTasks(userId: string, filters?: {
        isCompleted?: boolean;
        frequency?: TaskFrequency;
        priority?: TaskPriority;
        categoryId?: string;
    }) {
        const queryBuilder = this.taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.category", "category")
            .where("task.userId = :userId", { userId })
            .andWhere("task.isActive = :isActive", { isActive: true });

        if (filters?.isCompleted !== undefined) {
            queryBuilder.andWhere("task.isCompleted = :isCompleted", {
                isCompleted: filters.isCompleted
            });
        }

        if (filters?.frequency) {
            queryBuilder.andWhere("task.frequency = :frequency", {
                frequency: filters.frequency
            });
        }

        if (filters?.priority) {
            queryBuilder.andWhere("task.priority = :priority", {
                priority: filters.priority
            });
        }

        if (filters?.categoryId) {
            queryBuilder.andWhere("task.categoryId = :categoryId", {
                categoryId: filters.categoryId
            });
        }

        return await queryBuilder
            .orderBy("task.dueDate", "ASC")
            .addOrderBy("task.priority", "DESC")
            .getMany();
    }

    async getTodayTasks(userId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return await this.taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.category", "category")
            .where("task.userId = :userId", { userId })
            .andWhere("task.isActive = :isActive", { isActive: true })
            .andWhere("task.isCompleted = :isCompleted", { isCompleted: false })
            .andWhere(
                "(task.dueDate >= :today AND task.dueDate < :tomorrow) OR task.frequency = :daily",
                {
                    today,
                    tomorrow,
                    daily: TaskFrequency.DAILY
                }
            )
            .orderBy("task.priority", "DESC")
            .addOrderBy("task.dueDate", "ASC")
            .getMany();
    }

    async completeTask(userId: string, taskId: string) {
        const task = await this.taskRepository.findOne({
            where: { id: taskId, user: { id: userId } },
            relations: ["user", "category"],
        });

        if (!task) {
            throw new Error("Tarea no encontrada");
        }

        if (task.isCompleted) {
            throw new Error("La tarea ya está completada");
        }

        const now = new Date();
        const wasOnTime = !task.dueDate || now <= task.dueDate;

        // Calcular puntos (bonus por completar a tiempo)
        let pointsEarned = task.pointsReward;
        if (wasOnTime && task.dueDate) {
            pointsEarned = Math.floor(pointsEarned * 1.2); // 20% bonus
        }

        // Marcar tarea como completada
        task.isCompleted = true;
        task.completedAt = now;
        await this.taskRepository.save(task);

        // Crear registro de completación
        const completion = this.completionRepository.create({
            user: task.user,
            task,
            pointsEarned,
            wasOnTime,
            completionDate: now,
        });
        await this.completionRepository.save(completion);

        // Actualizar puntos del usuario
        task.user.totalPoints += pointsEarned;

        // Actualizar racha
        await this.updateUserStreak(task.user);
        await this.userRepository.save(task.user);

        // Actualizar progreso del usuario
        await this.updateUserProgress(userId);

        // Actualizar estadísticas de la mascota
        await this.petService.updatePetStats(userId, pointsEarned);

        // Si es una tarea recurrente, crear la siguiente instancia
        if (task.frequency !== TaskFrequency.ONCE) {
            await this.createRecurringTask(task);
        }

        return {
            task,
            pointsEarned,
            wasOnTime,
        };
    }

    async updateTask(userId: string, taskId: string, updateData: {
        title?: string;
        description?: string;
        priority?: TaskPriority;
        dueDate?: Date;
        categoryId?: string;
    }) {
        const task = await this.taskRepository.findOne({
            where: { id: taskId, user: { id: userId } },
        });

        if (!task) {
            throw new Error("Tarea no encontrada");
        }

        if (updateData.categoryId) {
            const category = await this.categoryRepository.findOne({
                where: { id: updateData.categoryId },
            });
            if (category) {
                task.category = category;
            }
        }

        Object.assign(task, updateData);
        return await this.taskRepository.save(task);
    }

    async deleteTask(userId: string, taskId: string) {
        const task = await this.taskRepository.findOne({
            where: { id: taskId, user: { id: userId } },
        });

        if (!task) {
            throw new Error("Tarea no encontrada");
        }

        // Soft delete - marcar como inactiva
        task.isActive = false;
        return await this.taskRepository.save(task);
    }

    private async updateUserStreak(user: User) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Verificar si completó tareas ayer
        const completedYesterday = await this.completionRepository.count({
            where: {
                user: { id: user.id },
                completionDate: yesterday,
            },
        });

        // Verificar si completó tareas hoy
        const completedToday = await this.completionRepository.count({
            where: {
                user: { id: user.id },
                completionDate: today,
            },
        });

        if (completedToday > 0) {
            if (completedYesterday > 0 || user.currentStreak === 0) {
                user.currentStreak += 1;
            } else {
                user.currentStreak = 1;
            }

            if (user.currentStreak > user.longestStreak) {
                user.longestStreak = user.currentStreak;
            }
        }
    }

    private async updateUserProgress(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["progress"],
        });

        if (!user || !user.progress) return;

        const progress = user.progress;
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Tareas completadas hoy
        const completedToday = await this.completionRepository.count({
            where: {
                user: { id: userId },
                completionDate: today,
            },
        });

        // Tareas completadas esta semana
        const completedThisWeek = await this.completionRepository.count({
            where: {
                user: { id: userId },
                completionDate: startOfWeek,
            },
        });

        // Tareas completadas este mes
        const completedThisMonth = await this.completionRepository.count({
            where: {
                user: { id: userId },
                completionDate: startOfMonth,
            },
        });

        // Total de tareas completadas
        const totalCompleted = await this.completionRepository.count({
            where: {
                user: { id: userId },
            },
        });

        progress.tasksCompletedToday = completedToday;
        progress.tasksCompletedThisWeek = completedThisWeek;
        progress.tasksCompletedThisMonth = completedThisMonth;
        progress.totalTasksCompleted = totalCompleted;
        progress.lastUpdated = today;

        await this.progressRepository.save(progress);
    }

    private async createRecurringTask(originalTask: Task) {
        const nextDueDate = this.calculateNextDueDate(
            originalTask.dueDate || new Date(),
            originalTask.frequency
        );

        const newTask = this.taskRepository.create({
            title: originalTask.title,
            description: originalTask.description,
            priority: originalTask.priority,
            frequency: originalTask.frequency,
            dueDate: nextDueDate,
            pointsReward: originalTask.pointsReward,
            user: originalTask.user,
            category: originalTask.category,
        });

        await this.taskRepository.save(newTask);
    }

    private calculateNextDueDate(currentDate: Date, frequency: TaskFrequency): Date {
        const nextDate = new Date(currentDate);

        switch (frequency) {
            case TaskFrequency.DAILY:
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case TaskFrequency.WEEKLY:
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case TaskFrequency.MONTHLY:
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
        }

        return nextDate;
    }

    async getTaskStats(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["progress"],
        });

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        const totalTasks = await this.taskRepository.count({
            where: { user: { id: userId }, isActive: true },
        });

        const completedTasks = await this.taskRepository.count({
            where: {
                user: { id: userId },
                isActive: true,
                isCompleted: true
            },
        });

        const pendingTasks = totalTasks - completedTasks;

        return {
            totalTasks,
            completedTasks,
            pendingTasks,
            completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
            totalPoints: user.totalPoints,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            progress: user.progress,
        };
    }
}