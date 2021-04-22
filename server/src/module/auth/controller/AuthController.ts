import { Application, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { User } from "../../user/entities/User";
import { AuthService } from "../service/AuthService";
import { jwtAuthentication, localAuthentication } from "../util/passportMiddlewares";

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
        app.post(`/api${ROUTE}/refresh`, this.refresh.bind(this))
    }

    login(req: Request, res: Response): Response {
        const user = req.user as User
        const userAndTokens = this.authService.login(user)
        const { refresh_token, ...clientResponse} = userAndTokens
        res.cookie("refresh", refresh_token)
        return res.status(200).send(clientResponse)
    }

    refresh(req: Request, res: Response): Response {
        console.log(req.cookies())
        // await this.authService.refreshToken()
        return res.status(200).send(req.user)
    }
}