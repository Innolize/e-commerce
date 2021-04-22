import { Application } from "express"
import { Container } from "inversify"
import { TYPES } from "../../config/inversify.types"
import { UserController } from "./controller/UserController"

export * from "./controller/UserController"
export * from "./service/UserService"
export * from "./model/UserModel"
export * from "./repository/UserRepository"

export function init(app: Application, container: Container): void {
    const controller = container.get<UserController>(TYPES.User.Controller)
    controller.configureRoutes(app)
}