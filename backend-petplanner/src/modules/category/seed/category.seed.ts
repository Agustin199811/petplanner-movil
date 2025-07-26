import { TypeOrmConfig } from "../../../common/config/database.config";
import { Category } from "../entity/category.entity";

export async function seedCategories() {
    const categoryRepository = TypeOrmConfig.getRepository(Category);

    // Verificar si ya existen categorías
    const existingCategories = await categoryRepository.count();
    if (existingCategories > 0) {
        console.log("Las categorías ya existen, saltando seeder...");
        return;
    }

    const defaultCategories = [
        {
            name: "Tareas del hogar",
            color: "#FFB800",
            icon: "home",
            pointsReward: 15,
        },
        {
            name: "Ejercicio",
            color: "#FF6B35",
            icon: "activity",
            pointsReward: 20,
        },
        {
            name: "Estudio",
            color: "#F7931E",
            icon: "book",
            pointsReward: 25,
        },
        {
            name: "Trabajo",
            color: "#4A90E2",
            icon: "briefcase",
            pointsReward: 20,
        },
        {
            name: "Salud",
            color: "#7ED321",
            icon: "heart",
            pointsReward: 30,
        },
        {
            name: "Personal",
            color: "#9013FE",
            icon: "user",
            pointsReward: 10,
        },
    ];

    const categories = categoryRepository.create(defaultCategories);
    await categoryRepository.save(categories);

    console.log("Categorías por defecto creadas exitosamente");
}