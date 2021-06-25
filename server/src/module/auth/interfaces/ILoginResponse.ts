import { User } from "../../user/entities/User";

type IBasicUser = Pick<User, 'id' | 'mail' | 'role_id' | 'cart'>

export interface ILoginResponse {
    user: IBasicUser,
    access_token: string,
    refresh_token: string
}