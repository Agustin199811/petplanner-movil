import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PetMood, PetType } from "../enum/pet.enum";
import { User } from "../../user/entity/user.entity";

@Entity()
export class Pet {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({
        type: "enum",
        enum: PetType,
        default: PetType.DOG,
    })
    type!: PetType;

    @Column({ default: 100 })
    happiness!: number; // 0-100

    @Column({ default: 100 })
    health!: number; // 0-100

    @Column({ default: 100 })
    energy!: number; // 0-100

    @Column({ default: 1 })
    level!: number;

    @Column({ default: 0 })
    experience!: number;

    @Column({
        type: "enum",
        enum: PetMood,
        default: PetMood.HAPPY,
    })
    currentMood!: PetMood;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    lastFed!: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    lastPlayed!: Date;

    @Column({ default: false })
    isAway!: boolean; // Si la mascota se fue por descuido

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToOne(() => User, (user) => user.pet)
    @JoinColumn()
    user!: User;
} 
