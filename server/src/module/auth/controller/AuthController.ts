import { Application, Request, Response } from "express";
import passport from "passport";
import { AbstractController } from "../../abstractClasses/abstractController";

export class AuthController extends AbstractController {
    private ROUTE: string
    constructor(
    ) {
        super()
        this.ROUTE = '/auth'
    }

    configureRoutes(app: Application): void {
        const ROUTE = this.ROUTE
        app.post(`/api${ROUTE}`, passport.authenticate('local', { session: false }), this.login.bind(this))


    }

    login(req: Request, res: Response): Response {
        console.log(req.body)
        return res.status(200).send("asd")
    }
}