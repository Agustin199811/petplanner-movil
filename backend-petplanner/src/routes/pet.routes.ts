import { Router } from "express";
import { PetController } from "../modules/pet/pet.controller";
import { authenticateToken } from "../modules/auth/middleware/auth.middleware";

const petRouter = Router();
const petController = new PetController();

// Todas las rutas requieren autenticación
petRouter.use(authenticateToken);

// Estado y acciones de la mascota
petRouter.get("/status", petController.getPetStatus);
petRouter.post("/feed", petController.feedPet);
petRouter.post("/play", petController.playWithPet);
petRouter.post("/recover", petController.recoverPet);

export default petRouter;