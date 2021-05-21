import { actions, subjects } from "../util/abilityBuilder";

export interface IPermissionModelAttributes {
    id: number
    action: typeof actions[number]
    subject: typeof subjects[number],
    conditions?: string
}