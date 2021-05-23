import { AnyObject } from "@casl/ability/dist/types/types"
import { IPermissionCreate } from "../interfaces/IPermissionCreate"
import { actions, subjects } from "../util/abilityBuilder"

export class Permission {
    id?: number
    action: typeof actions[number]
    subject: typeof subjects[number]
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