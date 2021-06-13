import { fromDbToProduct } from "../../../product/mapper/productMapper"
import { VideoCard } from "../entities/VideoCard"
import { IVideoCard } from "../interface/IVideoCard"
import { IVideoCardCreate } from "../interface/IVideoCardCreate"

export const fromRequestToVideoCard = (model: IVideoCardCreate): VideoCard => {
    const { clock_speed, watts, memory, id_product, id, version } = model
    return new VideoCard(version, memory, clock_speed, watts, id_product, id)
}

export const fromDbToVideoCard = (model: IVideoCard): VideoCard => {
    const { clock_speed, id, id_product, product, memory, version, watts } = model
    const ramProduct = product ? fromDbToProduct(product) : undefined
    return new VideoCard(version, memory, clock_speed, watts, id_product, id, ramProduct)
}