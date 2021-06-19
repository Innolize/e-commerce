import { actions, subjects } from '../../authorization/util/abilityBuilder'

export interface IPermissionCreate {
    role_id: number,
    action: typeof actions[number],
    subject: typeof subjects[number],
    id?: number,
    condition?: string,
}