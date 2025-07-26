import { NextFunction, Request, Response } from "express";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${req.method}] ${req.originalUrl} - Request recived`);
    res.on('finish', () => {
        console.log(`Status code : ${res.statusCode}`);
    });
    next();
}