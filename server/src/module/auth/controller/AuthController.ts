import { Application, NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { ILoginResponse } from "../interfaces/ILoginResponse";
import { AuthService } from "../service/AuthService";
import { localAuthentication } from "../util/passportMiddlewares";

@injectable()
export class AuthController extends AbstractController {
    private authService: AuthService
    private ROUTE: string
    private uploadMiddleware: Multer
    constructor(
        @inject(TYPES.Auth.Service) authService: AuthService,
        @inject(TYPES.Common.UploadMiddleware) uploadMiddleware: Multer
    ) {
        super()
        this.ROUTE = '/auth'
        this.authService = authService
        this.uploadMiddleware = uploadMiddleware
    }

    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE
        app.post(`/api${ROUTE}`, this.uploadMiddleware.none(), localAuthentication, this.login.bind(this))
        app.post(`/api${ROUTE}/refresh`, this.refresh.bind(this))
        app.post(`/api${ROUTE}/logout`, this.logOut.bind(this))
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user
            const { refresh_token, ...clientResponse } = await this.authService.login(user.id as number)
            res.cookie("refresh", refresh_token)
            res.status(200).send(clientResponse)
        } catch (err) {
            next(err)
        }

    }

    async logOut(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refresh }: { refresh: string | null } = req.cookies
            if (!refresh) {
                throw new Error('You were not logged')
            }
            res.clearCookie("refresh")
            res.status(200).send({ message: "You've been logged out" })
        } catch (err) {
            next(err)
        }

    }

    async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const refreshCookie = req.cookies.refresh
            if (!refreshCookie) {
                throw Error("Refresh token not found!")
            }
            const { refresh_token, ...clientResponse } = await this.authService.refreshToken(refreshCookie) as ILoginResponse
            res.cookie("refresh", refresh_token)
            res.status(200).send(clientResponse)
        } catch (err) {
            next(err)
        }

    }
}