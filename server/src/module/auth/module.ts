import { Application } from "express";
import { AuthController } from "./controller/AuthController";

export * from './controller/AuthController'
// export * from './service/AuthService'

export function init(app: Application): void {
    const controller = new AuthController()
    controller.configureRoutes(app)
}