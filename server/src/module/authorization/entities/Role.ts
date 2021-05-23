import { IRoleCreate } from "../interfaces/IRoleCreate"
import { RawRuleOf } from "@casl/ability"
import {appAbility} from '../util/abilityBuilder'
import { Permission } from "./Permission"

export class Role {
    id?: number
    name: string
    permissions?: Permission[]
    constructor({ id, name, permissions }: IRoleCreate) {
        if (id) {
            this.id = id
        }
        this.name = name
        if (permissions) {
            this.permissions = permissions.map(permission => new Permission(permission))
        }
    }
}