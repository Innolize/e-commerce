import { SIZE } from "../../../../config/constants/pcbuilder";
import { Product } from "../../../product/entity/Product";

export interface ICabinet {
    id: number,
    size: typeof SIZE,
    generic_pws: boolean,
    product?: Product
}

