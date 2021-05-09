import { IPermissionCreate } from "../interfaces/IPermissionCreate"

export type Actions = 'create' | 'read' | 'update' | 'delete'
export type Subject = 'User' | 'Product' | 'Category' | 'Brand'

export class Permission {
    id?: number
    action: Actions
    subject: Subject
    condition?: unknown
    constructor({ id, action, subject, conditions }: IPermissionCreate) {
        if (id) {
            this.id = id
        }
        this.action = action,
            this.subject = subject
        if (conditions) {
            this.condition = JSON.parse(conditions)
        }
    }
}