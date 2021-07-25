import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/inversify.types";
import { AbstractService } from "../../abstractClasses/abstractService";
import { sign, verify } from 'jsonwebtoken'
import { ILoginResponse } from "../interfaces/ILoginResponse";
import { IJwtToken } from "../interfaces/IJwtToken";
import { IUserRepository } from "../../user/interfaces/IUserRepository";

@injectable()
export class AuthService extends AbstractService {
    constructor(
        @inject(TYPES.User.Repository) private userRepository: IUserRepository
    ) {
        super()
        this.userRepository = userRepository
    }
    async login(userId: number): Promise<ILoginResponse> {
        const user = await this.userRepository.getSingleUser(userId)
        const { id, mail, role_id, cart } = user
        const payload = { sub: id }
        const access_token = this.signAccessToken(payload)
        const refresh_token = this.signRefreshToken(payload)
        return {
            user: { id, cart, mail, role_id },
            access_token,
            refresh_token
        }
    }



    async refreshToken(refreshToken: string): Promise<ILoginResponse> {

        const token = verify(refreshToken, <string>process.env.JWT_SECRET_REFRESH) as IJwtToken
        const { sub } = token
        const payload = { sub }
        const user = await this.userRepository.getSingleUser(sub)
        const { password, role, id, ...rest } = user
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

    signAccessToken(payload: { sub: number | undefined }): string {
        return sign(payload, <string>process.env.JWT_SECRET, { expiresIn: "6h" })
    }
}