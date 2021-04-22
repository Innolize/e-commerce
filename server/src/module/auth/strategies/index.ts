import { Container } from "inversify";
import { PassportStatic } from "passport";
import { TYPES } from "../../../config/inversify.types";
import { UserService } from "../../user/module";
import { configureJwtStrategy } from "./JwtStrategy";
import { configureLocalStrategy } from "./LocalStrategy";


export const configurePassportStrategies = (container: Container, passport: PassportStatic): void => {
    const userService = container.get<UserService>(TYPES.User.Service)
    configureJwtStrategy(userService, passport)
    configureLocalStrategy(userService, passport)
}