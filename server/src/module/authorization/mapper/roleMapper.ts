import { Role } from "../entities/Role"
import { IRole } from "../interfaces/IRole"
import { IRoleCreate } from "../interfaces/IRoleCreate"
import { fromDbToPermission } from "./permissionMapper"

export const fromDbToRole = (model: IRole): Role => {
    const { name, id, permissions } = model
    const rolePermissions = permissions ? permissions.map(fromDbToPermission) : undefined
    return new Role(name, id, rolePermissions)
}

export const fromRequestToRole = (request: IRoleCreate): Role => {
    const { name } = request
    return new Role(name)
}