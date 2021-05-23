import { actions, subjects } from '../../authorization/util/abilityBuilder'

export interface IPermissionCreate {
    id?: number,
    action: typeof actions[number],
    subject: typeof subjects[number],
    conditions?: string,
}