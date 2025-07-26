import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { PetType } from "../pet/enum/pet.enum";

export class AuthController {
    private authService = new AuthService();

    register = async (req: Request, res: Response) => {
        try {
            const { username, email, password, petName, petType } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({
                    error: "Username, email y password son requeridos",
                });
            }

            const result = await this.authService.register({
                username,
                email,
                password,
                petName,
                petType: petType || PetType.DOG,
            });

            res.status(201).json({
                message: "Usuario registrado exitosamente",
                data: result,
            });
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : "Error al registrar usuario",
            });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    error: "Email y password son requeridos",
                });
            }

            const result = await this.authService.login(email, password);

            res.json({
                message: "Login exitoso",
                data: result,
            });
        } catch (error) {
            res.status(401).json({
                error: error instanceof Error ? error.message : "Error en el login",
            });
        }
    };

    getProfile = async (req: any, res: Response) => {
        try {
            const user = req.user;

            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    totalPoints: user.totalPoints,
                    currentStreak: user.currentStreak,
                    longestStreak: user.longestStreak,
                },
                pet: user.pet ? {
                    id: user.pet.id,
                    name: user.pet.name,
                    type: user.pet.type,
                    happiness: user.pet.happiness,
                    health: user.pet.health,
                    energy: user.pet.energy,
                    level: user.pet.level,
                    currentMood: user.pet.currentMood,
                    isAway: user.pet.isAway,
                } : null,
                progress: user.progress,
            });
        } catch (error) {
            res.status(500).json({
                error: "Error al obtener el perfil",
            });
        }
    };
}
