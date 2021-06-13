import { DISK_TYPE } from "../../../../config/constants/pcbuilder";
import { Product } from "../../../product/entity/Product";

export interface IDiskStorage {
    total_storage: number,
    type: typeof DISK_TYPE[number],
    mbs: number,
    watts: number,
    id_product: number,
    id?: number,
    product?: Product
}

