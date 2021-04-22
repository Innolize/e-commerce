import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { User } from "../../user/entities/User";
import { UserRepository } from "../../user/module";
import { sign, verify } from 'jsonwebtoken'
import { ILoginResponse } from "../interfaces/ILoginResponse";
import { createCipher } from "node:crypto";

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
        const access_token = this.signAccessToken(payload)
        const refresh_token = this.createRefreshToken(payload)
        return {
            user: { id, ...rest },
            access_token,
            refresh_token
        }
    }

    createRefreshToken(id: { sub: number | undefined }): string {
        return sign(id, <string>process.env.JWT_SECRET_REFRESH, { expiresIn: "3d" })
    }

    async refreshToken(refreshToken: string) {
        try {
            const token = verify(refreshToken, <string>process.env.JWT_SECRET_REFRESH)
            console.log(token)
            // const { sub } = token
            // const user = await this.userService.getUser(Number(token.sub))
            // const access_token = sign(token, <string>process.env.JWT_SECRET, { expiresIn: "6h" })
        } catch (err) {
            throw Error(err.message)
        }
    }

    signAccessToken(payload: { sub: number | undefined }): string {
        return sign(payload, <string>process.env.JWT_SECRET, { expiresIn: "6h" })
    }
}