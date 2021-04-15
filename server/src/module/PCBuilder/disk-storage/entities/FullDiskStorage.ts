import { Product } from "../../../product/entity/Product"
import { IDiskStorage } from "../interface/IDiskStorage"

export class FullDiskStorage {
    id: number
    total_storage: number
    type: "SSD" | "HDD"
    mbs: number
    watts: number
    product?: Product
    constructor({ id, mbs, total_storage, type, watts, product }: IDiskStorage) {
        this.id = id,
            this.total_storage = total_storage,
            this.type = type,
            this.mbs = mbs,
            this.watts = watts
        if (product) {
            this.product = new Product(product)
        }
    }
}