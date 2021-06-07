import { fromRequestToProduct } from "../../../product/mapper/productMapper"
import { Motherboard } from "../entity/Motherboard"
import { IMotherboard } from "../interface/IMotherboard"
import { IMotherboardCreate } from "../interface/IMotherboardCreate"
import { MotherboardModel } from "../model/motherboardModel"

export const fromRequestToMotherboard = (request: IMotherboardCreate): Motherboard => {
    const { cpu_brand, watts, min_frec, max_frec, id_product, id, cpu_socket, model_size, ram_version, video_socket } = request
    return new Motherboard(cpu_socket, cpu_brand, ram_version, min_frec, max_frec, video_socket, model_size, watts, id, id_product)
}

export const fromDbToMotherboard = (model: MotherboardModel): Motherboard => {
    const motherboard = model.toJSON() as Motherboard
    const { cpu_brand, id, id_product, product, cpu_socket, max_frec, min_frec, model_size, ram_version, video_socket, watts } = motherboard
    const motherboardProduct = product ? fromRequestToProduct(product) : undefined
    return new Motherboard(cpu_socket, cpu_brand, ram_version, min_frec, max_frec, video_socket, model_size, watts, id, id_product, motherboardProduct)
}