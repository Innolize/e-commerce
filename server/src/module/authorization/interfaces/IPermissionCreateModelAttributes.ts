import { actions, subjects } from '../../authorization/util/abilityBuilder'

export interface IPermissionCreateModelAttributes {
    id?: number,
    action: typeof actions[number],
    subject: typeof subjects[number],
    conditions?: string,
    role_id: number
}