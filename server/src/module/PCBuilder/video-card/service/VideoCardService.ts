import { inject, injectable } from "inversify";
import { TYPES } from "../../../../config/inversify.types";
import { AbstractService } from "../../../abstractClasses/abstractService";
import { Product } from "../../../product/entity/Product";
import { VideoCard } from "../entities/VideoCard";
import { IVideoCardQuery } from "../interface/IVideoCardQuery";
import { VideoCardRepository } from "../repository/VideoCardRepository";

@injectable()
export class VideoCardService extends AbstractService {
    private videoCardRepository: VideoCardRepository
    constructor(
        @inject(TYPES.PCBuilder.VideoCard.Repository) videoCardRepository: VideoCardRepository
    ) {
        super()
        this.videoCardRepository = videoCardRepository
    }

    async getVideoCard(query?: IVideoCardQuery): Promise<VideoCard[]> {
        return await this.videoCardRepository.getVideoCards(query)
    }

    async getSingleVideoCard(id: number): Promise<VideoCard | Error> {
        return await this.videoCardRepository.getSingleVideoCard(id)
    }

    async createVideoCard(product: Product, videoCard: VideoCard): Promise<VideoCard | Error> {
        return await this.videoCardRepository.createVideoCard(product, videoCard)
    }

    async modifyVideoCard(id: number, videoCard: VideoCard): Promise<VideoCard | Error> {
        return await this.videoCardRepository.modifyVideoCard(id, videoCard)
    }
    async deleteVideoCard(id: number): Promise<true | Error> {
        return await this.videoCardRepository.deleteVideoCard(id)
    }
}