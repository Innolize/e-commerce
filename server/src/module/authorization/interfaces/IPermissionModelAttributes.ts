import { Subject } from "@casl/ability";
import { Actions } from "../entities/Permission";


export interface IPermissionModelAttributes {
    id: number
    action: Actions
    subject: Subject,
    conditions?: string
}