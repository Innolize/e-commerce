import { Ability } from "@casl/ability";
import { User } from "../../user/entities/User";

type userWithoutRole = Omit<User, 'role'>

export interface IUserWithAuthorization extends userWithoutRole{
    role: Ability
}