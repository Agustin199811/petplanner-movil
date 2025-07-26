import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entity/user.entity";
import { Category } from "../../category/entity/category.entity";
import { TaskFrequency, TaskPriority } from "../enum/task.enum";
import { TaskCompletion } from "../../taskcompletion/entity/taskcompletion.entity";

@Entity()
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    title!: string;

    @Column({ nullable: true })
    description!: string;

    @Column({
        type: "enum",
        enum: TaskPriority,
        default: TaskPriority.MEDIUM,
    })
    priority!: TaskPriority;

    @Column({
        type: "enum",
        enum: TaskFrequency,
        default: TaskFrequency.ONCE,
    })
    frequency!: TaskFrequency;

    @Column({ nullable: true })
    dueDate!: Date;

    @Column({ default: false })
    isCompleted!: boolean;

    @Column({ type: "timestamp", nullable: true })
    completedAt!: Date;

    @Column({ default: 10 })
    pointsReward!: number;

    @Column({ default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, (user) => user.tasks)
    @JoinColumn()
    user!: User;

    @ManyToOne(() => Category, (category) => category.tasks)
    @JoinColumn()
    category!: Category;

    @OneToMany(() => TaskCompletion, (completion) => completion.task)
    completions!: TaskCompletion[];
}