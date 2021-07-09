import { Permission } from "../entities/Permission";

export type IRoleName = "ADMIN" | "CLIENT"

export interface IRole {
    name: IRoleName
    id?: number
    permissions?: Permission[]
}