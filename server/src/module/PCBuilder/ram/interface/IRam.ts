import { RAM_VERSION } from "../../../../config/constants/pcbuilder";
import { Product } from "../../../product/entity/Product";

export interface IRam {
    ram_version: typeof RAM_VERSION[number],
    memory: number,
    min_frec: number,
    max_frec: number,
    watts: number,
    id_product: number,
    id?: number,
    product?: Product
}

