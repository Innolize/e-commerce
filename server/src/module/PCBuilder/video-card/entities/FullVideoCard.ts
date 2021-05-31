import { Product } from "../../../product/entity/Product"
import { fromRequestToProduct } from "../../../product/mapper/productMapper"
import { IVideoCard } from "../interface/IVideoCard"

export class FullVideoCard {
    id: number
    version: "DDR4" | "DDR5" | "DDR6"
    memory: number
    clock_speed: number
    watts: number
    product?: Product
    constructor({ id, memory, watts, product, clock_speed, version }: IVideoCard) {
        this.id = id,
            this.version = version,
            this.memory = memory,
            this.clock_speed = clock_speed,
            this.watts = watts
        if (product) {
            this.product = fromRequestToProduct(product)
        }
    }
}