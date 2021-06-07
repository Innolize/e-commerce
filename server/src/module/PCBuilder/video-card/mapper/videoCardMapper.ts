import { fromRequestToProduct } from "../../../product/mapper/productMapper"
import { VideoCard } from "../entities/VideoCard"
import { IVideoCardCreate } from "../interface/IVideoCardCreate"
import { VideoCardModel } from "../model/VideoCardModel"

export const fromRequestToVideoCard = (model: IVideoCardCreate): VideoCard => {
    const { clock_speed, watts, memory, id_product, id, version } = model
    return new VideoCard(version, memory, clock_speed, watts, id, id_product)
}

export const fromDbToVideoCard = (model: VideoCardModel): VideoCard => {
    const videoCard = model.toJSON() as VideoCard
    const { clock_speed, id, id_product, product, memory, version, watts } = videoCard
    const ramProduct = product ? fromRequestToProduct(product) : undefined
    return new VideoCard(version, memory, clock_speed, watts, id, id_product, ramProduct)
}