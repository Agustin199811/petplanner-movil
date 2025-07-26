import { NextFunction, Response } from "express";
import { AuthRequest } from "../interface/auth.interface";
import jwt from "jsonwebtoken";
import { TypeOrmConfig } from "../../../common/config/database.config";
import { User } from "../../user/entity/user.entity";


export const authenticateToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {

    const authHeader = req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token de acceso requerido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const userRepository = TypeOrmConfig.getRepository(User);

        const user = await userRepository.findOne({
            where: { id: decoded.userId },
            relations: ["pet", "progress"],
        });

        if (!user) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido" });
    }
};
