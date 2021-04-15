import { DISK_TYPE } from "../../../../config/constants/pcbuilder";
import { IProductCreate } from "../../../product/interfaces/IProductCreate";

export interface IDiskStorage_Product extends IDiskStorageCreate, IProductCreate { }

export interface IDiskStorageCreate {
    id?: number,
    total_storage: number,
    type: typeof DISK_TYPE,
    mbs: number,
    watts: number,
    id_product?: number
}