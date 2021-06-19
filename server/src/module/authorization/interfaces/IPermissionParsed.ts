import { AnyObject } from "@casl/ability/dist/types/types";
import { IPermission } from "./IPermission";

export type IPermissionConditionParsed = Omit<IPermission, 'condition'> & {
    condition: AnyObject
}