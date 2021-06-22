import { Ability } from "@casl/ability";
import { User } from "../../user/entities/User";
import { appAbility } from "../util/abilityBuilder";

type userWithoutRole = Omit<User, 'role' | 'password'>

export interface IUserWithAuthorization extends userWithoutRole {
    role: appAbility
}