import { SIZE } from "../../../../config/constants/pcbuilder";
import { Product } from "../../../product/entity/Product";

export interface ICabinet {
    size: typeof SIZE[number],
    generic_pws: boolean,
    id_product: number,
    id?: number,
    product?: Product,
}

