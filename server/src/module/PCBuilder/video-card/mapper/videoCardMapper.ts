import { fromDbToProduct } from "../../../product/mapper/productMapper"
import { VideoCard } from "../entities/VideoCard"
import { IVideoCard } from "../interface/IVideoCard"
import { IVideoCardCreate, IVideoCard_Product } from "../interface/IVideoCardCreate"

export const fromRequestToVideoCardCreate = (request: IVideoCard_Product): IVideoCardCreate => {
    const { version, memory, clock_speed, watts, product } = request
    return { version, memory, clock_speed, watts, product }
}

export const fromDbToVideoCard = (model: IVideoCard): VideoCard => {
    const { clock_speed, id, id_product, product, memory, version, watts } = model
    const ramProduct = product ? fromDbToProduct(product) : undefined
    return new VideoCard(version, memory, clock_speed, watts, id_product, id, ramProduct)
}