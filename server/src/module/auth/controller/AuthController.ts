import { Application, Request, Response } from "express";
import { inject, injectable } from "inversify";
import passport from "passport";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { User } from "../../user/entities/User";
import { AuthService } from "../service/AuthService";
import { localAuthentication } from "../util/passportMiddlewares";

@injectable()
export class AuthController extends AbstractController {
    private authService: AuthService
    private ROUTE: string
    constructor(
        @inject(TYPES.Auth.Service) authService: AuthService
    ) {
        super()
        this.ROUTE = '/auth'
        this.authService = authService
    }

    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE
        app.post(`/api${ROUTE}`, localAuthentication, this.login.bind(this))
    }

    login(req: Request, res: Response): Response {
        const user = req.user as User
        const userAndToken = this.authService.login(user)
        return res.status(200).send(userAndToken)
    }
}