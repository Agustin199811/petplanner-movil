import { TypeOrmConfig } from "../../common/config/database.config";
import { User } from "../user/entity/user.entity";
import { Pet } from "./entity/pet.entity";
import { PetMood } from "./enum/pet.enum";

export class PetService {
    private petRepository = TypeOrmConfig.getRepository(Pet);
    private userRepository = TypeOrmConfig.getRepository(User);

    async updatePetStats(userId: string, pointsEarned: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["pet"],
        });

        if (!user || !user.pet) {
            throw new Error("Usuario o mascota no encontrada");
        }

        const pet = user.pet;

        // Aumentar experiencia y felicidad
        pet.experience += pointsEarned;
        pet.happiness = Math.min(100, pet.happiness + Math.floor(pointsEarned / 2));
        pet.health = Math.min(100, pet.health + 1);
        pet.energy = Math.max(0, pet.energy - 1);

        // Verificar si sube de nivel
        const experienceNeeded = pet.level * 100;
        if (pet.experience >= experienceNeeded) {
            pet.level += 1;
            pet.experience = pet.experience - experienceNeeded;
            pet.happiness = Math.min(100, pet.happiness + 20);
        }

        // Actualizar humor basado en estadísticas
        pet.currentMood = this.calculateMood(pet);
        pet.isAway = false;

        await this.petRepository.save(pet);
        return pet;
    }

    async degradePetStats(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["pet"],
        });

        if (!user || !user.pet) {
            return;
        }

        const pet = user.pet;
        const now = new Date();
        const lastActive = new Date(user.lastActiveDate);
        const hoursSinceActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

        if (hoursSinceActive > 24) {
            // Degradar estadísticas por inactividad
            pet.happiness = Math.max(0, pet.happiness - Math.floor(hoursSinceActive / 24) * 10);
            pet.health = Math.max(0, pet.health - Math.floor(hoursSinceActive / 24) * 5);
            pet.energy = Math.max(0, pet.energy - Math.floor(hoursSinceActive / 24) * 15);

            // Si las estadísticas están muy bajas, la mascota se va
            if (pet.happiness < 20 && pet.health < 20) {
                pet.isAway = true;
                pet.currentMood = PetMood.VERY_SAD;
            } else {
                pet.currentMood = this.calculateMood(pet);
            }

            await this.petRepository.save(pet);
        }
    }

    async feedPet(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["pet"],
        });

        if (!user || !user.pet) {
            throw new Error("Mascota no encontrada");
        }

        const pet = user.pet;
        pet.happiness = Math.min(100, pet.happiness + 10);
        pet.health = Math.min(100, pet.health + 15);
        pet.lastFed = new Date();
        pet.currentMood = this.calculateMood(pet);

        await this.petRepository.save(pet);
        return pet;
    }

    async playWithPet(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["pet"],
        });

        if (!user || !user.pet) {
            throw new Error("Mascota no encontrada");
        }

        const pet = user.pet;
        pet.happiness = Math.min(100, pet.happiness + 15);
        pet.energy = Math.max(0, pet.energy - 10);
        pet.lastPlayed = new Date();
        pet.currentMood = this.calculateMood(pet);

        await this.petRepository.save(pet);
        return pet;
    }

    async recoverPet(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["pet"],
        });

        if (!user || !user.pet) {
            throw new Error("Mascota no encontrada");
        }

        const pet = user.pet;

        // Resetear estadísticas a un nivel básico
        pet.happiness = 50;
        pet.health = 70;
        pet.energy = 80;
        pet.isAway = false;
        pet.currentMood = PetMood.NEUTRAL;

        await this.petRepository.save(pet);
        return pet;
    }

    private calculateMood(pet: Pet): PetMood {
        const avgStats = (pet.happiness + pet.health + pet.energy) / 3;

        if (avgStats >= 80) return PetMood.VERY_HAPPY;
        if (avgStats >= 60) return PetMood.HAPPY;
        if (avgStats >= 40) return PetMood.NEUTRAL;
        if (avgStats >= 20) return PetMood.SAD;
        return PetMood.VERY_SAD;
    }

    async getPetStatus(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["pet"],
        });

        if (!user || !user.pet) {
            throw new Error("Mascota no encontrada");
        }

        // Verificar y degradar estadísticas si es necesario
        await this.degradePetStats(userId);

        // Obtener mascota actualizada
        const updatedPet = await this.petRepository.findOne({
            where: { id: user.pet.id },
        });

        return updatedPet;
    }
}
