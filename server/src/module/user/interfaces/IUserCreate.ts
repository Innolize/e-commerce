import { Roles } from "../../../config/constants/roles";

export interface IUserCreate {
    id?: string,
    mail: string,
    password: string,
    role?: Roles
}