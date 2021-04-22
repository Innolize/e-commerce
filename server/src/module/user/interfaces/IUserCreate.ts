import { Roles } from "../../../config/constants/roles";

export interface IUserCreate {
    id?: number,
    mail: string,
    password: string,
    role?: Roles
}