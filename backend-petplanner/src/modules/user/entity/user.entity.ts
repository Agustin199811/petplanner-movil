import { IsEmail, IsString, MinLength } from "class-validator";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Pet } from "../../pet/entity/pet.entity";
import { Task } from "../../task/entity/task.entity";
import { TaskCompletion } from "../../taskcompletion/entity/taskcompletion.entity";
import { UserProgress } from "../../userprogress/entity/userprogress.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true })
    @IsString()
    username!: string;

    @Column({ unique: true })
    @IsEmail()
    email!: string;

    @Column()
    @IsString()
    @MinLength(6)
    password!: string;

    @Column({ default: 0 })
    totalPoints!: number;

    @Column({ default: 0 })
    currentStreak!: number;

    @Column({ default: 0 })
    longestStreak!: number;

    @Column({ type: "date", nullable: true })
    lastActiveDate!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Task, (task) => task.user)
    tasks!: Task[];

    @OneToMany(() => TaskCompletion, (completion) => completion.user)
    completions!: TaskCompletion[];

    @OneToOne(() => Pet, (pet) => pet.user)
    pet!: Pet;

    @OneToOne!(() => UserProgress, (progress) => progress.user)
    progress!: UserProgress;
}