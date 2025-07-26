import { Router } from "express";
import { authenticateToken } from "../modules/auth/middleware/auth.middleware";
import { TaskController } from "../modules/task/task.controller";

const taskRouter = Router();
const taskController = new TaskController();

// Todas las rutas requieren autenticación
taskRouter.use(authenticateToken);

// CRUD de tareas
taskRouter.post("/", taskController.createTask);
taskRouter.get("/", taskController.getTasks);
taskRouter.get("/today", taskController.getTodayTasks);
taskRouter.get("/stats", taskController.getTaskStats);
taskRouter.put("/:taskId", taskController.updateTask);
taskRouter.delete("/:taskId", taskController.deleteTask);

// Completar tarea
taskRouter.post("/:taskId/complete", taskController.completeTask);

export default taskRouter;