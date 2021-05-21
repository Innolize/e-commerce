import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { User } from "../../user/entities/User";
import { UserService } from "../../user/module";
import { sign, verify } from 'jsonwebtoken'
import { ILoginResponse } from "../interfaces/ILoginResponse";
import { IJwtToken } from "../interfaces/IJwtToken";
import { FullUser } from "../../user/entities/FullUser";

@injectable()
export class AuthService extends AbstractService {
    private userService: UserService
    constructor(
        @inject(TYPES.User.Service) userService: UserService
    ) {
        super()
        this.userService = userService
    }
    login(user: User): ILoginResponse {
        const { id, password, ...rest } = user
        const payload = { sub: id }
        const access_token = this.signAccessToken(payload)
        const refresh_token = this.signRefreshToken(payload)
        return {
            user: { id, ...rest },
            access_token,
            refresh_token
        }
    }

    signRefreshToken(id: { sub: number | undefined }): string {
        return sign(id, <string>process.env.JWT_SECRET_REFRESH, { expiresIn: "3d" })
    }

    async refreshToken(refreshToken: string): Promise<ILoginResponse | Error> {
        try {
            const token = verify(refreshToken, <string>process.env.JWT_SECRET_REFRESH) as IJwtToken
            const { sub } = token
            const payload = { sub }
            const user = await this.userService.getSingleUser(sub) as FullUser
            const { password, role, ...rest } = user
            const access_token = sign(rest, <string>process.env.JWT_SECRET, { expiresIn: "6h" })
            const refresh_token = this.signRefreshToken(payload)
            return {
                user: rest,
                access_token,
                refresh_token
            }
        } catch (err) {
            throw Error(err.message)
        }
    }

    signAccessToken(payload: { sub: number | undefined }): string {
        return sign(payload, <string>process.env.JWT_SECRET, { expiresIn: "6h" })
    }
}