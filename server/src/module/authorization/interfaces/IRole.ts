import { Permission } from "../entities/Permission";

export interface IRole{
    name: string
    id?: number
    permissions?: Permission[]
}