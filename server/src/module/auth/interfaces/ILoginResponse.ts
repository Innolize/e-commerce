import { User } from "../../user/entities/User";

type IPasswordlessUser = Omit<User, 'password' | 'role_id'>

export interface ILoginResponse {
    user: IPasswordlessUser,
    access_token: string,
    refresh_token: string
}