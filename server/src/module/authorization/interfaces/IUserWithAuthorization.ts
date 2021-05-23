import { Ability } from "@casl/ability";
import { FullUser } from "../../user/entities/FullUser";

type userWithoutRole = Omit<FullUser, 'role'>




export interface IUserWithAuthorization extends userWithoutRole{
    role: Ability
}