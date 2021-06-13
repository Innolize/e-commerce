import { DISK_TYPE } from "../../../../config/constants/pcbuilder";

export interface IDiskStorageGetAllQuery {
    limit?: number,
    offset?: number,
    type?: typeof DISK_TYPE[number],
}