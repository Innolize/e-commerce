import { Product } from "../../../product/entity/Product"
import { fromRequestToProduct } from "../../../product/mapper/productMapper"
import { IMotherboard } from "../interface/IMotherboard"

export class FullMotherboard {
    id: number
    cpu_socket: string
    cpu_brand: string
    ram_version: number
    min_frec: number
    max_frec: number
    video_socket: string
    model_size: string
    watts: number
    product?: Product
    constructor({ id, cpu_socket, cpu_brand, ram_version, min_frec, max_frec, video_socket, model_size, watts, product }: IMotherboard) {
        this.id = id,
            this.cpu_socket = cpu_socket,
            this.cpu_brand = cpu_brand,
            this.ram_version = ram_version,
            this.min_frec = min_frec,
            this.max_frec = max_frec,
            this.video_socket = video_socket,
            this.model_size = model_size,
            this.watts = watts
        if (product) {
            this.product = fromRequestToProduct(product)
        }

    }
}