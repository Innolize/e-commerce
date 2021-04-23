import { Permission } from "../entities/Permission";

export interface IRole {
    id?: number,
    name: string,
    permission: Permission[]
}