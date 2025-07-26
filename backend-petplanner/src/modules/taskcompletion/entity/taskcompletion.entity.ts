import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entity/user.entity";
import { Task } from "../../task/entity/task.entity";

@Entity()
export class TaskCompletion {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    pointsEarned!: number;

    @Column({ type: "date" })
    completionDate!: Date;

    @Column({ default: false })
    wasOnTime!: boolean; // Si se completó antes o en la fecha límite

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, (user) => user.completions)
    @JoinColumn()
    user!: User;

    @ManyToOne(() => Task, (task) => task.completions)
    @JoinColumn()
    task!: Task;
}