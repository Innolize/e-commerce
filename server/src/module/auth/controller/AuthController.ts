import { Request, Response } from "express";
import { AbstractController } from "../../abstractClasses/abstractController";

export class AuthController extends AbstractController {
    constructor() {
        super()
    }

    login(req: Request, res: Response): string {
        return 'response'
    }
}