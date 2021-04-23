import { Actions, Subject } from '../entities/Permission'

export interface IPermission {
    id?: number,
    action: Actions,
    subject: Subject
}