import { Actions, Subject } from '../entities/Permission'

export interface IPermissionCreateModelAttributes {
    id?: number,
    action: Actions,
    subject: Subject,
    conditions?: string,
    role_id: number
}