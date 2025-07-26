import dotenv from 'dotenv';
import { DataSource } from 'typeorm';



dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';
export const TypeOrmConfig = new DataSource({
    type: process.env.DB_TYPE as any,
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: isDevelopment ? ["src/modules/**/entity/*.ts"] : ["dist/modules/**/entity/*.js"],
    migrations: isDevelopment ? ["src/migrations/*.ts"] : ["dist/migrations/*.js"],
    synchronize: false,
    logging: true
})