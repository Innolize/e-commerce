import { Product } from "../../../product/entity/Product"
import { fromRequestToProduct } from "../../../product/mapper/productMapper"
import { IRam } from "../interface/IRam"

export class FullRam {
    id: number
    ram_version: "DDR1" | "DDR2" | "DDR3" | "DDR4"
    memory: number
    min_frec: number
    max_frec: number
    watts: number
    product?: Product
    constructor({ id, memory, ram_version, min_frec, max_frec, watts, product }: IRam) {
        this.id = id,
            this.ram_version = ram_version,
            this.memory = memory,
            this.min_frec = min_frec,
            this.max_frec = max_frec,
            this.watts = watts
        if (product) {
            this.product = fromRequestToProduct(product)
        }
    }
}