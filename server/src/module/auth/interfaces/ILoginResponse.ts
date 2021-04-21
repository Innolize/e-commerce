import { User } from "../../user/entities/User";

type UserPasswordless = Omit<User, 'password'>

export interface ILoginResponse {
    user: UserPasswordless,
    access_token: string
}