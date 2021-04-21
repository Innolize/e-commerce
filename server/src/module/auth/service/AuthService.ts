import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { User } from "../../user/entities/User";
import { UserRepository } from "../../user/module";
import { sign } from 'jsonwebtoken'
import { ILoginResponse } from "../interfaces/ILoginResponse";

@injectable()
export class AuthService extends AbstractService {
    private userRepository: UserRepository
    constructor(
        @inject(TYPES.User.Service) userRepository: UserRepository
    ) {
        super()
        this.userRepository = userRepository
    }
    login(user: User): ILoginResponse {
        const { id, password, ...rest } = user
        const payload = { sub: id }
        const access_token = sign(payload, <string>process.env.JWT_SECRET, { expiresIn: "1h" })
        return {
            user: { id, ...rest },
            access_token
        }
    }
}