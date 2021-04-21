import { Application } from "express";
import { AuthController } from "./controller/AuthController";

export function init(app: Application): void {
    const controller = new AuthController()
    controller.configureRoutes(app)
}