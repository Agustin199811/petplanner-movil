import { Response } from "express";
import { AuthRequest } from "../auth/interface/auth.interface";
import { PetService } from "../pet/pet.service";

export class PetController {
    private petService = new PetService();

    getPetStatus = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const pet = await this.petService.getPetStatus(userId);

            res.json({
                data: pet,
            });
        } catch (error) {
            res.status(404).json({
                error: error instanceof Error ? error.message : "Error al obtener mascota",
            });
        }
    };

    feedPet = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const pet = await this.petService.feedPet(userId);

            res.json({
                message: "Mascota alimentada exitosamente",
                data: pet,
            });
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : "Error al alimentar mascota",
            });
        }
    };

    playWithPet = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const pet = await this.petService.playWithPet(userId);

            res.json({
                message: "Jugaste con tu mascota",
                data: pet,
            });
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : "Error al jugar con mascota",
            });
        }
    };

    recoverPet = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const pet = await this.petService.recoverPet(userId);

            res.json({
                message: "Tu mascota ha regresado",
                data: pet,
            });
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : "Error al recuperar mascota",
            });
        }
    };
}
