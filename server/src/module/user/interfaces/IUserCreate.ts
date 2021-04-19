import { roles } from "../../../config/constants/roles";

export interface IUserCreate {
    mail: string,
    password: string,
    role?: roles
}