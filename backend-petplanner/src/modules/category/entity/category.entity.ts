import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Task } from "../../task/entity/task.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    color!: string; // Color hex para la UI

    @Column()
    icon!: string; // Nombre del icono

    @Column({ default: 10 })
    pointsReward!: number; // Puntos base que otorga completar tareas de esta categoría

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Task, (task) => task.category)
    tasks!: Task[];
}