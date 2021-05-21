import { RawRuleOf } from "@casl/ability";
import { Permission } from "../entities/Permission";
import { appAbility } from "../util/abilityBuilder";

export interface IRoleCreate {
    id?: number,
    name: string,
    permissions?: Permission[]
}