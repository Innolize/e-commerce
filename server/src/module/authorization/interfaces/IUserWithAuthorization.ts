import { User } from "../../user/entities/User";
import { appAbility } from "../util/abilityBuilder";
import { IRoleName } from "./IRole";

type userWithoutRole = Omit<User, 'role' | 'password' | 'id'>

export interface PermissionRole {
    name: IRoleName
    permissions: appAbility
}

export interface IUserWithAuthorization extends userWithoutRole {
    id: number,
    role: PermissionRole
}