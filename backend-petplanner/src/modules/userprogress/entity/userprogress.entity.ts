import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entity/user.entity";

@Entity()
export class UserProgress {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ default: 0 })
    totalTasksCompleted!: number;

    @Column({ default: 0 })
    tasksCompletedToday!: number;

    @Column({ default: 0 })
    tasksCompletedThisWeek!: number;

    @Column({ default: 0 })
    tasksCompletedThisMonth!: number;

    @Column({ type: "json", nullable: false })
    weeklyProgress!: Record<string, number>;

    @Column({ type: "json", nullable: false })
    categoryStats!: Record<string, number>;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    lastUpdated!: Date;


    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToOne(() => User, (user) => user.progress)
    @JoinColumn()
    user!: User;
}