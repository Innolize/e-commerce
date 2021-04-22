import { Application, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { User } from "../../user/entities/User";
import { ILoginResponse } from "../interfaces/ILoginResponse";
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
        app.post(`/api${ROUTE}/refresh`, this.refresh.bind(this))
    }

    login(req: Request, res: Response): Response {
        const user = req.user as User
        const { refresh_token, ...clientResponse } = this.authService.login(user)
        res.cookie("refresh", refresh_token)
        return res.status(200).send(clientResponse)
    }

    async refresh(req: Request, res: Response): Promise<Response> {
        try {
            const refreshCookie = req.cookies.refresh
            if (!refreshCookie) {
                throw Error("Refresh cookie not found!")
            }
            const { refresh_token, ...clientResponse } = await this.authService.refreshToken(refreshCookie) as ILoginResponse
            res.cookie("refresh", refresh_token)
            return res.status(200).send(clientResponse)
        } catch (err) {
            return res.status(500).send({ error: err.message })
        }

    }
}