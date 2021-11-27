import { Container } from "inversify";
import { PassportStatic } from "passport";
import { TYPES } from "../../../config/inversify.types";
import { IUserRepository } from "../../user/interfaces/IUserRepository";
import { configureJwtStrategy } from "./JwtStrategy";
import { configureLocalStrategy } from "./LocalStrategy";


export const configurePassportStrategies = (container: Container, passport: PassportStatic): void => {
    const userRepository = container.get<IUserRepository>(TYPES.User.Repository)
    configureLocalStrategy(userRepository, passport)
    configureJwtStrategy(userRepository, passport)
}