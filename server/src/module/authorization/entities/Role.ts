import { IRoleCreate } from "../interfaces/IRoleCreate"
import { IPermissionCreate } from '../interfaces/IPermissionCreate'
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
            this.permissions = permissions.map(x => new Permission(x as IPermissionCreate))
        }
    }
}