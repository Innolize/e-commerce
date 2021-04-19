import { Roles } from "../../../config/constants/roles";

export interface IUserCreate {
    mail: string,
    password: string,
    role?: Roles
}