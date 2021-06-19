import { Permission } from "../entities/Permission"
import { IPermission } from "../interfaces/IPermission"
import { IPermissionCreate } from "../interfaces/IPermissionCreate"

export const fromDbToPermission = (model: IPermission): Permission => {
    const { action, role_id, subject, id, condition } = model
    return new Permission(role_id, action, subject, id, condition)
}

export const fromRequestToPermission = (request: IPermissionCreate): Permission => {
    const { action, subject, condition, id, role_id } = request
    return new Permission(role_id, action, subject, id, condition)
}