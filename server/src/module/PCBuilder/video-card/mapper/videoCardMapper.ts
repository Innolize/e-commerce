import { FullVideoCard } from "../entities/FullVideoCard"
import { VideoCard } from "../entities/VideoCard"
import { VideoCardModel } from "../model/VideoCardModel"

export const fromDbToFullVideoCard = (model: VideoCardModel): FullVideoCard => {
    return new FullVideoCard(model.toJSON() as FullVideoCard)
}

export const fromDbToVideoCard = (model: VideoCardModel): VideoCard => {
    return new VideoCard(model.toJSON() as VideoCard)
}