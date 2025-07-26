import { TypeOrmConfig } from "../../common/config/database.config";
import { Pet } from "../pet/entity/pet.entity";
import { PetType } from "../pet/enum/pet.enum";
import { User } from "../user/entity/user.entity";
import { UserProgress } from "../userprogress/entity/userprogress.entity";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
    private userRepository = TypeOrmConfig.getRepository(User);
    private petRepository = TypeOrmConfig.getRepository(Pet);
    private progressRepository = TypeOrmConfig.getRepository(UserProgress);

    async register(userData: {
        username: string;
        email: string;
        password: string;
        petName?: string;
        petType?: PetType;
    }) {
        const { username, email, password, petName = "Mochi", petType = PetType.DOG } = userData;

        // Verificar si el usuario ya existe
        const existingUser = await this.userRepository.findOne({
            where: [{ email }, { username }],
        });

        if (existingUser) {
            throw new Error("El usuario o email ya existe");
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = this.userRepository.create({
            username,
            email,
            password: hashedPassword,
            lastActiveDate: new Date(),
        });

        const savedUser = await this.userRepository.save(user);

        // Crear mascota inicial
        const pet = this.petRepository.create({
            name: petName,
            type: petType,
            user: savedUser,
        });

        await this.petRepository.save(pet);

        // Crear progreso inicial
        const progress = this.progressRepository.create({
            user: savedUser,
            weeklyProgress: {}, // inicializa vacío o con algún dato inicial
            categoryStats: {}, // inicializa vacío o con algún dato inicial
        });

        await this.progressRepository.save(progress);

        // Generar token
        const token = jwt.sign(
            { userId: savedUser.id },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN as any }
        );

        return {
            user: {
                id: savedUser.id,
                username: savedUser.username,
                email: savedUser.email,
                totalPoints: savedUser.totalPoints,
                currentStreak: savedUser.currentStreak,
            },
            pet: {
                id: pet.id,
                name: pet.name,
                type: pet.type,
                happiness: pet.happiness,
                health: pet.health,
                energy: pet.energy,
                level: pet.level,
                currentMood: pet.currentMood,
            },
            token,
        };
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ["pet", "progress"],
        });

        if (!user) {
            throw new Error("Credenciales inválidas");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new Error("Credenciales inválidas");
        }

        // Actualizar última fecha activa
        user.lastActiveDate = new Date();
        await this.userRepository.save(user);

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN as any }
        );

        return {
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
            token,
        };
    }
}