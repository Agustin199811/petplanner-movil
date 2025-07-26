import { Router } from "express";
import { AuthController } from "../modules/auth/auth.controller";
import { authenticateToken } from "../modules/auth/middleware/auth.middleware";

const authRoute = Router();
const authController = new AuthController();

// Rutas públicas
authRoute.post("/register", authController.register);
authRoute.post("/login", authController.login);

// Rutas protegidas
authRoute.get("/profile", authenticateToken, authController.getProfile);

export default authRoute;