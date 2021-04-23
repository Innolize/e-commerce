import { Actions, Subject } from '../entities/Permission'

export interface IPermissionCreate {
    id?: number,
    action: Actions,
    subject: Subject
}