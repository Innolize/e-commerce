import { IPermission } from "../interfaces/IPermission"

export type Actions = 'create' | 'read' | 'update' | 'delete'
export type Subject = 'User' | 'Product' | 'Category' | 'Brand'

export class Permission {
    id?: number
    action: Actions
    subject: Subject
    constructor({ id, action, subject }: IPermission) {
        if (id) {
            this.id = id
        }
        this.action = action,
            this.subject = subject
    }
}