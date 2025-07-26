import { plainToClass } from "class-transformer"
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express"

export const validateDTO = (ClassDTO: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoInstance = plainToClass(ClassDTO, req.body);
        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
            return res.status(400).json({ errors: errors.map((err) => err.constraints) });
        }
        req.body = dtoInstance;
        next();
    }
}