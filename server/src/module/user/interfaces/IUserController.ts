import { Application, NextFunction, Request, Response } from "express";

export interface IUserController {
    configureRoutes: (app: Application) => void;
    getUsers: (req: Request, res: Response, next: NextFunction) => void;
    getSingleUser: (req: Request, res: Response, next: NextFunction) => void;
    createUser: (req: Request, res: Response, next: NextFunction) => void;
    deleteUser: (req: Request, res: Response, next: NextFunction) => void;
    editUser: (req: Request, res: Response, next: NextFunction) => void;   
}