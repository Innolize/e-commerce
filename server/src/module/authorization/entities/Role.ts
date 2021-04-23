import { IRole } from "../interfaces/IRole"
import { Permission } from "./Permission"

export class Role {
    id?: number
    name: string
    permissions: Permission[]
    constructor({ id, name, permission }: IRole) {
        if (id) {
            this.id = id
        }
        this.name = name,
            this.permissions = permission
    }
}