import { IPermission } from "../interfaces/IPermission"
import { actions, subjects } from "../util/abilityBuilder"

export class Permission implements IPermission {

    constructor(
        public role_id: number,
        public action: typeof actions[number],
        public subject: typeof subjects[number],
        public id?: number,
        public condition?: string
    ) { }

}