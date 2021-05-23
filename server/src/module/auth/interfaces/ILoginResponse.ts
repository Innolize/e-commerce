import { User } from "../../user/entities/User";

type UserPasswordless = Omit<User, 'password' | 'role_id'>

export interface ILoginResponse {
    user: UserPasswordless,
    access_token: string,
    refresh_token: string
}