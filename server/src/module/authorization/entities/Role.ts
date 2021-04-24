import { IRoleCreate } from "../interfaces/IRoleCreate"
import { Permission } from "./Permission"
// import { Permission } from "./Permission"

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
            this.permissions = permissions
        }
    }
}