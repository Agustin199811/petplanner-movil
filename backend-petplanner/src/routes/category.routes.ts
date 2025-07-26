import { Router } from "express";
import { authenticateToken } from "../modules/auth/middleware/auth.middleware";
import { CategoryController } from "../modules/category/category.controller";


const categoryRouter = Router();
const categoryController = new CategoryController();


// Obtener categorías (público)
categoryRouter.get("/", categoryController.getCategories);

// Rutas protegidas
categoryRouter.use(authenticateToken);
categoryRouter.post("/", categoryController.createCategory);
categoryRouter.put("/:categoryId", categoryController.updateCategory);
categoryRouter.delete("/:categoryId", categoryController.deleteCategory);

export default categoryRouter