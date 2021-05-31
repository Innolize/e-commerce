import { Product } from "../../../product/entity/Product"
import { fromRequestToProduct } from "../../../product/mapper/productMapper"
import { IProcessor } from "../interface/IProcessor"

export class FullProcessor {
    id: number
    cores: number
    frecuency: number
    socket: number
    watts: number
    product?: Product
    constructor({ id, cores, frecuency, socket, watts, product }: IProcessor) {
        this.id = id,
            this.cores = cores,
            this.frecuency = frecuency,
            this.socket = socket,
            this.watts = watts
        if (product) {
            this.product = fromRequestToProduct(product)
        }
    }
}