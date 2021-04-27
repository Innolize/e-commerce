import { Roles } from "../../../config/constants/roles";
import { Role } from "../../authorization/entities/Role";

export interface IUserCreate {
    id?: number,
    mail: string,
    password: string,
    role_id: number
}