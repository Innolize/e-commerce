import { Product } from "../../../product/entity/Product";

export interface IRam {
    id: number,
    ram_version: "DDR1" | "DDR2" | "DDR3" | "DDR4",
    memory: number,
    min_frec: number,
    max_frec: number,
    watts: number,
    product?: Product
}

