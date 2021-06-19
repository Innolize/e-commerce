import { actions, subjects } from "../util/abilityBuilder";

export interface IPermission {
    role_id: number,
    action: typeof actions[number],
    subject: typeof subjects[number],
    id?: number,
    condition?: string
}