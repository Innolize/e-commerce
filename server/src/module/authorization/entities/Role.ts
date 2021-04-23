import { IRoleCreate } from "../interfaces/IRoleCreate"
import { Permission } from "./Permission"

export class Role {
    id?: number
    name: string
    permissions: Permission[]
    constructor({ id, name, permission }: IRoleCreate) {
        if (id) {
            this.id = id
        }
        this.name = name,
            this.permissions = permission
    }
}