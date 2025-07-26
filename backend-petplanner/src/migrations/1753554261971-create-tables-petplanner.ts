import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablesPetplanner1753554261971 implements MigrationInterface {
    name = 'CreateTablesPetplanner1753554261971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`pet\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`type\` enum ('dog', 'cat', 'rabbit', 'bird') NOT NULL DEFAULT 'dog', \`happiness\` int NOT NULL DEFAULT '100', \`health\` int NOT NULL DEFAULT '100', \`energy\` int NOT NULL DEFAULT '100', \`level\` int NOT NULL DEFAULT '1', \`experience\` int NOT NULL DEFAULT '0', \`currentMood\` enum ('very_happy', 'happy', 'neutral', 'sad', 'very_sad') NOT NULL DEFAULT 'happy', \`lastFed\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`lastPlayed\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`isAway\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, UNIQUE INDEX \`REL_4eb3b1eeefc7cdeae09f934f47\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`color\` varchar(255) NOT NULL, \`icon\` varchar(255) NOT NULL, \`pointsReward\` int NOT NULL DEFAULT '10', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`task_completion\` (\`id\` varchar(36) NOT NULL, \`pointsEarned\` int NOT NULL, \`completionDate\` date NOT NULL, \`wasOnTime\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`taskId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`task\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`priority\` enum ('low', 'medium', 'high') NOT NULL DEFAULT 'medium', \`frequency\` enum ('once', 'daily', 'weekly', 'monthly') NOT NULL DEFAULT 'once', \`dueDate\` datetime NULL, \`isCompleted\` tinyint NOT NULL DEFAULT 0, \`completedAt\` timestamp NULL, \`pointsReward\` int NOT NULL DEFAULT '10', \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`categoryId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`totalPoints\` int NOT NULL DEFAULT '0', \`currentStreak\` int NOT NULL DEFAULT '0', \`longestStreak\` int NOT NULL DEFAULT '0', \`lastActiveDate\` date NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_progress\` (\`id\` varchar(36) NOT NULL, \`totalTasksCompleted\` int NOT NULL DEFAULT '0', \`tasksCompletedToday\` int NOT NULL DEFAULT '0', \`tasksCompletedThisWeek\` int NOT NULL DEFAULT '0', \`tasksCompletedThisMonth\` int NOT NULL DEFAULT '0', \`weeklyProgress\` json NOT NULL, \`categoryStats\` json NOT NULL, \`lastUpdated\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, UNIQUE INDEX \`REL_b5d0e1b57bc6c761fb49e79bf8\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`pet\` ADD CONSTRAINT \`FK_4eb3b1eeefc7cdeae09f934f479\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task_completion\` ADD CONSTRAINT \`FK_4f2115a26dfccea5e2b9e16b682\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task_completion\` ADD CONSTRAINT \`FK_9d19317fa142d926adf8256ef2b\` FOREIGN KEY (\`taskId\`) REFERENCES \`task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_f316d3fe53497d4d8a2957db8b9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_586dfdcae7fab5d9723506049a7\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_progress\` ADD CONSTRAINT \`FK_b5d0e1b57bc6c761fb49e79bf89\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_progress\` DROP FOREIGN KEY \`FK_b5d0e1b57bc6c761fb49e79bf89\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_586dfdcae7fab5d9723506049a7\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_f316d3fe53497d4d8a2957db8b9\``);
        await queryRunner.query(`ALTER TABLE \`task_completion\` DROP FOREIGN KEY \`FK_9d19317fa142d926adf8256ef2b\``);
        await queryRunner.query(`ALTER TABLE \`task_completion\` DROP FOREIGN KEY \`FK_4f2115a26dfccea5e2b9e16b682\``);
        await queryRunner.query(`ALTER TABLE \`pet\` DROP FOREIGN KEY \`FK_4eb3b1eeefc7cdeae09f934f479\``);
        await queryRunner.query(`DROP INDEX \`REL_b5d0e1b57bc6c761fb49e79bf8\` ON \`user_progress\``);
        await queryRunner.query(`DROP TABLE \`user_progress\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`task\``);
        await queryRunner.query(`DROP TABLE \`task_completion\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP INDEX \`REL_4eb3b1eeefc7cdeae09f934f47\` ON \`pet\``);
        await queryRunner.query(`DROP TABLE \`pet\``);
    }

}
