import { RAM_VERSION } from "../../../../config/constants/pcbuilder";
import { Product } from "../../../product/entity/Product";

export interface IRam {
    id: number,
    ram_version: typeof RAM_VERSION[number],
    memory: number,
    min_frec: number,
    max_frec: number,
    watts: number,
    product?: Product
}

