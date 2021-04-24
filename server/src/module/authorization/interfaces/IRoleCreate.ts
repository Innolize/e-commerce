import { Permission } from "../entities/Permission";

export interface IRoleCreate {
    id?: number,
    name: string,
    permissions?: Permission[]
}