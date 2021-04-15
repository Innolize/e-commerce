import { Product } from "../../../product/entity/Product";

export interface IDiskStorage {
    id: number,
    total_storage: number,
    type: "SSD" | "HDD",
    mbs: number,
    watts: number,
    product?: Product
}

