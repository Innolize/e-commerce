import { User } from "../../user/entities/User";
import { appAbility } from "../util/abilityBuilder";

type userWithoutRole = Omit<User, 'role' | 'password' | 'id'>

export interface IUserWithAuthorization extends userWithoutRole {
    id: number,
    role: appAbility
}