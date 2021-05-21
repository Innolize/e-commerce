import { AnyObject } from "@casl/ability/dist/types/types"
import { IPermissionCreate } from "../interfaces/IPermissionCreate"

export type Actions = 'create' | 'read' | 'update' | 'delete'
export type Subject = 'Product' | 'Brand'

export class Permission {
    id?: number
    action: Actions
    subject: Subject
    condition?: AnyObject
    constructor({ id, action, subject, conditions }: IPermissionCreate) {
        if (id) {
            this.id = id
        }
        this.action = action
        this.subject = subject
        if (conditions) {
            this.condition = JSON.parse(conditions)
        }
    }
}