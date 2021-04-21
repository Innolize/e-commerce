import { Application, Request, Response } from "express";
import passport from "passport";
import { AbstractController } from "../../abstractClasses/abstractController";
import { localAuthentication } from "../util/passportMiddlewares";

export class AuthController extends AbstractController {
    private ROUTE: string
    constructor(
    ) {
        super()
        this.ROUTE = '/auth'
    }

    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE
        app.post(`/api${ROUTE}`, localAuthentication, this.login.bind(this))
    }

    login(req: Request, res: Response): Response {
        return res.status(200).send(req.user)
    }
}