import { Application, NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Multer } from "multer";
import { TYPES } from "../../../config/inversify.types";
import { AbstractController } from "../../abstractClasses/abstractController";
import { bodyValidator } from "../../common/helpers/bodyValidator";
import { validateCreateUserDto } from "../../user/helper/create_dto_validator";
import { IUserCreate } from "../../user/interfaces/IUserCreate";
import { UserService } from "../../user/module";
import { AuthenticationError } from "../error/AuthenticationError";
import { AuthService } from "../service/AuthService";
import { localAuthentication } from "../util/passportMiddlewares";

@injectable()
export class AuthController extends AbstractController {
    private ROUTE: string
    constructor(
        @inject(TYPES.Auth.Service) private authService: AuthService,
        @inject(TYPES.Common.UploadMiddleware) private uploadMiddleware: Multer,
        @inject(TYPES.User.Service) private userService: UserService
    ) {
        super()
        this.ROUTE = '/auth'
        this.authService = authService
        this.uploadMiddleware = uploadMiddleware
        this.userService = userService
    }

    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE
        app.post(`/api${ROUTE}`, this.uploadMiddleware.none(), localAuthentication, this.login.bind(this))
        app.post(`/api${ROUTE}/refresh`, this.refresh.bind(this))
        app.post(`/api${ROUTE}/logout`, this.logOut.bind(this))
        app.post(`/api${ROUTE}/signup`, this.uploadMiddleware.none(), this.signup.bind(this))
    }

    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user = req.user
        try {
            const dto: IUserCreate = req.body
            const validatedDto = await bodyValidator(validateCreateUserDto, dto)
            const rolename = 'CLIENT'
            const { id } = await this.userService.createUser(validatedDto, rolename)
            const { refresh_token, ...clientResponse } = await this.authService.login(id)
            res.cookie("refresh", refresh_token)
            res.status(200).send(clientResponse)
        } catch (err) {
            next(err)
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user
            console.log(user)
            const { refresh_token, ...clientResponse } = await this.authService.login(user.id)
            res.cookie("refresh", refresh_token)
            res.status(200).send(clientResponse)
        } catch (err) {
            next(err)
        }

    }

    async logOut(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refresh }: { refresh: string | undefined } = req.cookies
            if (!refresh) {
                throw AuthenticationError.notLogged()
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
                throw AuthenticationError.refreshTokenNotFound()
            }
            const { refresh_token, ...clientResponse } = await this.authService.refreshToken(refreshCookie)
            res.cookie("refresh", refresh_token)
            res.status(200).send(clientResponse)
        } catch (err) {
            next(err)
        }

    }
}