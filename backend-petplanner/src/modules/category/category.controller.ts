import { Request, Response } from "express";
import { TypeOrmConfig } from "../../common/config/database.config";
import { Category } from "./entity/category.entity";

export class CategoryController {
    private categoryRepository = TypeOrmConfig.getRepository(Category);

    getCategories = async (req: Request, res: Response): Promise<void> => {
        try {
            const categories = await this.categoryRepository.find({
                order: { name: "ASC" },
            });

            res.json({
                data: categories,
            });
        } catch (error) {
            res.status(500).json({
                error: "Error al obtener categorías",
            });
        }
    };

    createCategory = async (req: Request, res: Response) => {
        try {
            const { name, color, icon, pointsReward } = req.body;

            if (!name || !color || !icon) {
                return res.status(400).json({
                    error: "Nombre, color e icono son requeridos",
                });
            }

            const category = this.categoryRepository.create({
                name,
                color,
                icon,
                pointsReward: pointsReward || 10,
            });

            const savedCategory = await this.categoryRepository.save(category);

            res.status(201).json({
                message: "Categoría creada exitosamente",
                data: savedCategory,
            });
        } catch (error) {
            res.status(400).json({
                error: "Error al crear categoría",
            });
        }
    };

    updateCategory = async (req: Request, res: Response) => {
        try {
            const { categoryId } = req.params;
            const updateData = req.body;

            const category = await this.categoryRepository.findOne({
                where: { id: categoryId },
            });

            if (!category) {
                return res.status(404).json({
                    error: "Categoría no encontrada",
                });
            }

            Object.assign(category, updateData);
            const updatedCategory = await this.categoryRepository.save(category);

            res.json({
                message: "Categoría actualizada exitosamente",
                data: updatedCategory,
            });
        } catch (error) {
            res.status(400).json({
                error: "Error al actualizar categoría",
            });
        }
    };

    deleteCategory = async (req: Request, res: Response) => {
        try {
            const { categoryId } = req.params;

            const result = await this.categoryRepository.delete(categoryId);

            if (result.affected === 0) {
                return res.status(404).json({
                    error: "Categoría no encontrada",
                });
            }

            res.json({
                message: "Categoría eliminada exitosamente",
            });
        } catch (error) {
            res.status(400).json({
                error: "Error al eliminar categoría",
            });
        }
    };
}