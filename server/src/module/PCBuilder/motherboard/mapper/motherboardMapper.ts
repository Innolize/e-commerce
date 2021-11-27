import { fromDbToProduct } from "../../../product/mapper/productMapper"
import { Motherboard } from "../entity/Motherboard"
import { IMotherboardCreate, IMotherboard_Product } from "../interface/IMotherboardCreate"
import { MotherboardModel } from "../model/motherboardModel"

export const fromDbToMotherboard = (model: MotherboardModel): Motherboard => {
    const { cpu_brand, id, id_product, product, cpu_socket, max_frec, min_frec, model_size, ram_version, video_socket, watts } = model
    const motherboardProduct = product ? fromDbToProduct(product) : undefined
    return new Motherboard(cpu_socket, cpu_brand, ram_version, min_frec, max_frec, video_socket, model_size, watts, id_product, id, motherboardProduct)
}

export const fromRequestToMotherboardCreate = (request: IMotherboard_Product): IMotherboardCreate => {
    const { model_size, watts, ram_version, max_frec, product, cpu_brand, cpu_socket, video_socket, min_frec } = request
    return { cpu_brand, cpu_socket, max_frec, min_frec, model_size, ram_version, video_socket, watts, product }
}