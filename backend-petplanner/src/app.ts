import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { TypeOrmConfig } from "./common/config/database.config";
import { seedCategories } from "./modules/category/seed/category.seed";
import authRoute from "./routes/auth.routes";
import taskRouter from "./routes/task.routes";
import petRouter from "./routes/pet.routes";
import categoryRouter from "./routes/category.routes";
import { loggerMiddleware } from "./common/middleware/logger.middleware";
import cors from "cors";
// Cargar variables de entorno
dotenv.config();

const app = express();

app.use(
    cors({
        origin: `http://localhost:${process.env.PORT_REACT}`,

        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);


// CORS
app.use(express.json());
app.use(loggerMiddleware);




// Rutas de la API
app.use("/api/auth", authRoute);
app.use("/api/tasks", taskRouter);
app.use("/api/pet", petRouter);
app.use("/api/categories", categoryRouter);


app.get("/api/health", (req: Request, res: Response) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});



TypeOrmConfig.initialize()
    .then(async () => {
        console.log('Database initialized');

        // Cargar datos iniciales
        await seedCategories();
    })
    .catch(async (err) => {
        console.error(err);
        process.exit(1);
    });

export default app;