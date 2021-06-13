import { fromDbToProduct } from "../../../product/mapper/productMapper"
import { Motherboard } from "../entity/Motherboard"
import { IMotherboardCreate } from "../interface/IMotherboardCreate"
import { MotherboardModel } from "../model/motherboardModel"

export const fromRequestToMotherboard = (request: IMotherboardCreate): Motherboard => {
    const { cpu_brand, watts, min_frec, max_frec, id_product, id, cpu_socket, model_size, ram_version, video_socket } = request
    return new Motherboard(cpu_socket, cpu_brand, ram_version, min_frec, max_frec, video_socket, model_size, watts, id_product, id)
}

export const fromDbToMotherboard = (model: MotherboardModel): Motherboard => {
    const { cpu_brand, id, id_product, product, cpu_socket, max_frec, min_frec, model_size, ram_version, video_socket, watts } = model
    const motherboardProduct = product ? fromDbToProduct(product) : undefined
    return new Motherboard(cpu_socket, cpu_brand, ram_version, min_frec, max_frec, video_socket, model_size, watts, id_product, id, motherboardProduct)
}