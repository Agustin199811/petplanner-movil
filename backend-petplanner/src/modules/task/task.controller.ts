import { Response } from "express";
import { AuthRequest } from "../auth/interface/auth.interface";
import { TaskService } from "./task.service";
import { TaskFrequency, TaskPriority } from "./enum/task.enum";

export class TaskController {
    private taskService = new TaskService();

    createTask = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const { title, description, priority, frequency, dueDate, categoryId, pointsReward } = req.body;

            if (!title || !categoryId) {
                return res.status(400).json({
                    error: "Título y categoría son requeridos",
                });
            }

            const task = await this.taskService.createTask(userId, {
                title,
                description,
                priority: priority || TaskPriority.MEDIUM,
                frequency: frequency || TaskFrequency.ONCE,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                categoryId,
                pointsReward,
            });

            res.status(201).json({
                message: "Tarea creada exitosamente",
                data: task,
            });
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : "Error al crear tarea",
            });
        }
    };

    getTasks = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const { isCompleted, frequency, priority, categoryId } = req.query;

            const filters: any = {};

            if (isCompleted !== undefined) {
                filters.isCompleted = isCompleted === 'true';
            }
            if (frequency) filters.frequency = frequency as TaskFrequency;
            if (priority) filters.priority = priority as TaskPriority;
            if (categoryId) filters.categoryId = categoryId as string;

            const tasks = await this.taskService.getUserTasks(userId, filters);

            res.json({
                data: tasks,
            });
        } catch (error) {
            res.status(500).json({
                error: "Error al obtener tareas",
            });
        }
    };

    getTodayTasks = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const tasks = await this.taskService.getTodayTasks(userId);

            res.json({
                data: tasks,
            });
        } catch (error) {
            res.status(500).json({
                error: "Error al obtener tareas de hoy",
            });
        }
    };

    completeTask = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const { taskId } = req.params;

            const result = await this.taskService.completeTask(userId, taskId);

            res.json({
                message: "Tarea completada exitosamente",
                data: result,
            });
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : "Error al completar tarea",
            });
        }
    };

    updateTask = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const { taskId } = req.params;
            const updateData = req.body;

            const task = await this.taskService.updateTask(userId, taskId, updateData);

            res.json({
                message: "Tarea actualizada exitosamente",
                data: task,
            });
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : "Error al actualizar tarea",
            });
        }
    };

    deleteTask = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const { taskId } = req.params;

            await this.taskService.deleteTask(userId, taskId);

            res.json({
                message: "Tarea eliminada exitosamente",
            });
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : "Error al eliminar tarea",
            });
        }
    };

    getTaskStats = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const stats = await this.taskService.getTaskStats(userId);

            res.json({
                data: stats,
            });
        } catch (error) {
            res.status(500).json({
                error: "Error al obtener estadísticas",
            });
        }
    };
}